/*
# Create profiles and predictions tables

## 1. New Tables

### profiles
- `id` (uuid, primary key, references auth.users)
- `email` (text, unique)
- `role` (user_role enum, default: 'user', not null)
- `created_at` (timestamptz, default: now())
- `updated_at` (timestamptz, default: now())

### predictions
- `id` (uuid, primary key, default: gen_random_uuid())
- `user_id` (uuid, references profiles(id), not null)
- `symptoms` (jsonb, not null) - Array of symptom IDs
- `disease_id` (text, not null) - Predicted disease ID
- `disease_name` (text, not null)
- `confidence` (integer, not null) - Confidence score 0-100
- `matched_symptoms` (jsonb, not null) - Array of matched symptom IDs
- `created_at` (timestamptz, default: now())

## 2. Security

### profiles table
- Enable RLS
- Admin helper function to check user role
- Admins have full access to all profiles
- Users can read their own profile
- Users can update their own profile (except role field)

### predictions table
- Enable RLS
- Admins can view all predictions
- Users can only view their own predictions
- Users can insert their own predictions
- Users can delete their own predictions

## 3. Triggers

- Auto-insert into profiles after auth.users confirmation
- First user gets admin role, subsequent users get user role
- Update updated_at timestamp on profile updates

## 4. Indexes

- Index on predictions.user_id for fast queries
- Index on predictions.created_at for sorting
*/

-- Create user role enum
CREATE TYPE user_role AS ENUM ('user', 'admin');

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE,
  role user_role DEFAULT 'user'::user_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create predictions table
CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  symptoms jsonb NOT NULL,
  disease_id text NOT NULL,
  disease_name text NOT NULL,
  confidence integer NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  matched_symptoms jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_predictions_user_id ON predictions(user_id);
CREATE INDEX IF NOT EXISTS idx_predictions_created_at ON predictions(created_at DESC);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles p
    WHERE p.id = uid AND p.role = 'admin'::user_role
  );
$$;

-- Profiles policies
CREATE POLICY "Admins have full access to profiles" ON profiles
  FOR ALL TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT TO authenticated USING (auth.uid() = id);

CREATE POLICY "Users can update own profile (except role)" ON profiles
  FOR UPDATE TO authenticated 
  USING (auth.uid() = id) 
  WITH CHECK (auth.uid() = id AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Predictions policies
CREATE POLICY "Admins can view all predictions" ON predictions
  FOR SELECT TO authenticated USING (is_admin(auth.uid()));

CREATE POLICY "Users can view own predictions" ON predictions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own predictions" ON predictions
  FOR INSERT TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own predictions" ON predictions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Trigger function to handle new user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  user_count int;
BEGIN
  -- Only insert into profiles after user is confirmed
  IF OLD IS DISTINCT FROM NULL AND OLD.confirmed_at IS NULL AND NEW.confirmed_at IS NOT NULL THEN
    -- Count existing users in profiles
    SELECT COUNT(*) INTO user_count FROM profiles;
    
    -- Insert into profiles, first user gets admin role
    INSERT INTO profiles (id, email, role)
    VALUES (
      NEW.id,
      NEW.email,
      CASE WHEN user_count = 0 THEN 'admin'::user_role ELSE 'user'::user_role END
    );
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

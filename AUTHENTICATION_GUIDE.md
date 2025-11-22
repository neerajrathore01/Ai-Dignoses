# Authentication & Database Integration Guide

## Overview

The AI Disease Prediction System now includes full user authentication and database integration using Supabase. Users can create accounts, log in, and have their prediction history securely stored in the database.

## Features Implemented

### 1. User Authentication ✅
- **Email/Password Login**: Standard authentication with email and password
- **User Registration**: New users can create accounts
- **Session Management**: Automatic session handling with Supabase Auth
- **Protected Routes**: Dashboard and Admin pages require authentication
- **Public Access**: Home, Results, and History pages remain accessible to guests

### 2. User Profiles ✅
- **Profiles Table**: Stores user information and roles
- **Role-Based Access**: Two roles - `user` and `admin`
- **First User Admin**: The first registered user automatically becomes an administrator
- **Profile Management**: Users can view their profile information

### 3. Database-Stored Predictions ✅
- **Predictions Table**: All symptom analyses are stored in the database
- **User Association**: Each prediction is linked to the user who created it
- **Automatic Saving**: Predictions are automatically saved when logged in
- **Fallback to localStorage**: Guest users still use localStorage for history

### 4. Protected Dashboard ✅
- **Personal Dashboard**: Users can view their prediction history
- **Statistics**: Total predictions, monthly count, most common disease
- **History Management**: View and delete individual predictions
- **Detailed View**: See symptoms analyzed and matched for each prediction

### 5. Admin Dashboard ✅
- **User Management**: View all registered users
- **Role Management**: Admins can change user roles
- **System Statistics**: Total users, admins, predictions
- **Recent Activity**: View recent predictions across all users

## Database Schema

### Tables

#### profiles
```sql
- id (uuid, primary key, references auth.users)
- email (text, unique)
- role (user_role enum: 'user' | 'admin')
- created_at (timestamptz)
- updated_at (timestamptz)
```

#### predictions
```sql
- id (uuid, primary key)
- user_id (uuid, references profiles)
- symptoms (jsonb) - Array of symptom IDs
- disease_id (text) - Predicted disease ID
- disease_name (text)
- confidence (integer, 0-100)
- matched_symptoms (jsonb) - Array of matched symptom IDs
- created_at (timestamptz)
```

## Security Features

### Row Level Security (RLS)
All tables have RLS enabled with the following policies:

#### Profiles Table
- ✅ Admins can view/edit all profiles
- ✅ Users can view their own profile
- ✅ Users can update their own profile (except role field)

#### Predictions Table
- ✅ Admins can view all predictions
- ✅ Users can view only their own predictions
- ✅ Users can insert their own predictions
- ✅ Users can delete their own predictions

### Authentication Flow
1. User registers with email/password
2. Account is created in auth.users
3. Trigger automatically creates profile entry
4. First user gets admin role, others get user role
5. User is automatically logged in after registration

## User Guide

### For Regular Users

#### Creating an Account
1. Click "Sign In" in the header
2. Switch to "Sign Up" tab
3. Enter your email and password (minimum 6 characters)
4. Confirm your password
5. Click "Create Account"
6. You'll be automatically logged in

#### Logging In
1. Click "Sign In" in the header
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your dashboard

#### Using the Dashboard
1. After logging in, click your profile icon in the header
2. Select "My Dashboard"
3. View your statistics:
   - Total predictions
   - Predictions this month
   - Most common predicted disease
4. Browse your prediction history
5. Delete individual predictions if needed

#### Analyzing Symptoms
1. Go to the Home page
2. Select your symptoms
3. Click "Analyze Symptoms"
4. View results
5. **If logged in**: Prediction is automatically saved to your dashboard
6. **If not logged in**: Prediction is saved to browser localStorage

### For Administrators

#### Accessing Admin Panel
1. Log in with an admin account
2. Click your profile icon in the header
3. Select "Admin Panel"

#### Managing Users
1. In the Admin Dashboard, scroll to "User Management"
2. View all registered users
3. Change user roles using the dropdown:
   - Select "User" for regular access
   - Select "Admin" for administrative access
4. Changes are applied immediately

#### Viewing System Statistics
The Admin Dashboard shows:
- Total registered users
- Number of administrators
- Total predictions across all users
- Predictions this month
- Recent prediction activity

## Technical Implementation

### File Structure
```
src/
├── db/
│   ├── supabase.ts          # Supabase client configuration
│   └── api.ts               # Database API functions
├── types/
│   └── database.ts          # TypeScript types for database
├── pages/
│   ├── Login.tsx            # Login/Signup page
│   ├── Dashboard.tsx        # User dashboard
│   └── AdminDashboard.tsx   # Admin panel
├── services/
│   └── predictionService.ts # Updated with database saving
└── components/
    └── common/
        └── Header.tsx       # Updated with auth status
```

### Key Components

#### AuthProvider
Wraps the entire app and provides authentication context:
```tsx
<AuthProvider client={supabase}>
  {/* App content */}
</AuthProvider>
```

#### RequireAuth
Protects routes that require authentication:
```tsx
<RequireAuth whiteList={['/login', '/', '/results', '/history']}>
  {/* Protected content */}
</RequireAuth>
```

#### Database API
All database operations are centralized in `src/db/api.ts`:
- `profilesApi.getCurrentProfile()` - Get current user's profile
- `profilesApi.getAllProfiles()` - Get all profiles (admin only)
- `profilesApi.updateProfileRole()` - Update user role (admin only)
- `predictionsApi.createPrediction()` - Save new prediction
- `predictionsApi.getUserPredictions()` - Get user's predictions
- `predictionsApi.getAllPredictions()` - Get all predictions (admin only)
- `predictionsApi.deletePrediction()` - Delete a prediction
- `predictionsApi.getPredictionStats()` - Get user statistics

### Prediction Saving Logic

The `PredictionService.saveToHistory()` method now:
1. Checks if user is logged in
2. If logged in: Saves to database via `predictionsApi.createPrediction()`
3. If not logged in: Falls back to localStorage
4. On error: Falls back to localStorage

```typescript
static async saveToHistory(symptoms: string[], result: PredictionResult): Promise<void> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (user) {
      await predictionsApi.createPrediction({
        user_id: user.id,
        symptoms,
        disease_id: result.disease.id,
        disease_name: result.disease.name,
        confidence: result.confidence,
        matched_symptoms: result.matchedSymptoms,
      });
    } else {
      this.saveToLocalStorage(symptoms, result);
    }
  } catch (error) {
    console.error('Failed to save to database, falling back to localStorage:', error);
    this.saveToLocalStorage(symptoms, result);
  }
}
```

## Environment Variables

The following environment variables are configured in `.env`:

```env
VITE_SUPABASE_URL=https://oycotbcxerbdjibeqisy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Migration Files

### create_profiles_and_predictions.sql
This migration creates:
- `user_role` enum type
- `profiles` table with RLS policies
- `predictions` table with RLS policies
- Helper function `is_admin()` for role checking
- Trigger `handle_new_user()` for automatic profile creation
- Indexes for performance optimization

## Security Best Practices

### Implemented
✅ Row Level Security on all tables
✅ Password minimum length (6 characters)
✅ Email validation
✅ Secure session management
✅ Role-based access control
✅ SQL injection prevention (using Supabase client)
✅ XSS prevention (React escaping)

### Recommendations
- Use strong passwords (consider adding password strength indicator)
- Enable two-factor authentication (future enhancement)
- Regular security audits
- Monitor for suspicious activity

## Troubleshooting

### Cannot Log In
- Verify email and password are correct
- Check if email verification is required (currently disabled)
- Clear browser cache and try again

### Predictions Not Saving
- Ensure you're logged in
- Check browser console for errors
- Verify Supabase connection
- Falls back to localStorage if database fails

### Cannot Access Admin Panel
- Verify you have admin role
- First registered user is automatically admin
- Contact existing admin to change your role

### Database Connection Issues
- Check `.env` file has correct Supabase credentials
- Verify Supabase project is active
- Check browser console for specific errors

## Future Enhancements

Potential improvements for the authentication system:

1. **Email Verification**: Add email confirmation step
2. **Password Reset**: Implement forgot password functionality
3. **Profile Editing**: Allow users to update their profile information
4. **Two-Factor Authentication**: Add 2FA for enhanced security
5. **Social Login**: Add Google, GitHub, etc. authentication
6. **Activity Logs**: Track user actions for security auditing
7. **Export Data**: Allow users to export their prediction history
8. **Data Analytics**: Advanced analytics dashboard for admins
9. **Notification System**: Email notifications for important events
10. **API Rate Limiting**: Prevent abuse of the system

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check browser console for errors
4. Verify database schema matches migration files

---

**Status**: ✅ Production Ready
**Last Updated**: 2025-11-23
**Version**: 2.0 (With Authentication)

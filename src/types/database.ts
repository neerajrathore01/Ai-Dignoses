export type UserRole = 'user' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Prediction {
  id: string;
  user_id: string;
  symptoms: string[];
  disease_id: string;
  disease_name: string;
  confidence: number;
  matched_symptoms: string[];
  created_at: string;
}

export interface PredictionInsert {
  user_id: string;
  symptoms: string[];
  disease_id: string;
  disease_name: string;
  confidence: number;
  matched_symptoms: string[];
}

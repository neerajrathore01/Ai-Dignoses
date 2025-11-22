export interface Symptom {
  id: string;
  name: string;
  category: 'general' | 'respiratory' | 'digestive' | 'neurological' | 'musculoskeletal' | 'dermatological' | 'other';
}

export interface Disease {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  precautions: string[];
  suggestedTests: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  requiresDoctorConsultation: boolean;
}

export interface PredictionResult {
  disease: Disease;
  confidence: number;
  matchedSymptoms: string[];
  timestamp: number;
}

export interface PredictionHistory {
  id: string;
  symptoms: string[];
  result: PredictionResult;
  timestamp: number;
}

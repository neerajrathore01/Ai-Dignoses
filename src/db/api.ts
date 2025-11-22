import { supabase } from './supabase';
import type { Profile, Prediction, PredictionInsert } from '@/types/database';

export const profilesApi = {
  async getCurrentProfile(): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Error fetching current profile:', error);
      return null;
    }

    return data;
  },

  async getAllProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching profiles:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async updateProfileRole(userId: string, role: 'user' | 'admin'): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile role:', error);
      return false;
    }

    return true;
  },
};

export const predictionsApi = {
  async createPrediction(prediction: PredictionInsert): Promise<Prediction | null> {
    const { data, error } = await supabase
      .from('predictions')
      .insert(prediction)
      .select()
      .maybeSingle();

    if (error) {
      console.error('Error creating prediction:', error);
      return null;
    }

    return data;
  },

  async getUserPredictions(userId: string): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user predictions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async getAllPredictions(): Promise<Prediction[]> {
    const { data, error } = await supabase
      .from('predictions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all predictions:', error);
      return [];
    }

    return Array.isArray(data) ? data : [];
  },

  async deletePrediction(predictionId: string): Promise<boolean> {
    const { error } = await supabase
      .from('predictions')
      .delete()
      .eq('id', predictionId);

    if (error) {
      console.error('Error deleting prediction:', error);
      return false;
    }

    return true;
  },

  async getPredictionStats(userId: string): Promise<{
    total: number;
    thisMonth: number;
    mostCommonDisease: string | null;
  }> {
    const predictions = await this.getUserPredictions(userId);
    
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const thisMonthPredictions = predictions.filter(p => 
      new Date(p.created_at) >= firstDayOfMonth
    );

    const diseaseCounts: Record<string, number> = {};
    predictions.forEach(p => {
      diseaseCounts[p.disease_name] = (diseaseCounts[p.disease_name] || 0) + 1;
    });

    const mostCommonDisease = Object.keys(diseaseCounts).length > 0
      ? Object.entries(diseaseCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

    return {
      total: predictions.length,
      thisMonth: thisMonthPredictions.length,
      mostCommonDisease,
    };
  },
};

import type { Disease, PredictionResult, PredictionHistory } from '@/types/disease';
import { DISEASES } from '@/data/diseases';
import { supabase } from '@/db/supabase';
import { predictionsApi } from '@/db/api';

const HISTORY_STORAGE_KEY = 'disease_prediction_history';

export class PredictionService {
  static predictDisease(selectedSymptoms: string[]): PredictionResult[] {
    if (selectedSymptoms.length === 0) {
      return [];
    }

    const predictions: PredictionResult[] = [];

    for (const disease of DISEASES) {
      const matchedSymptoms = disease.symptoms.filter(symptom =>
        selectedSymptoms.includes(symptom)
      );

      if (matchedSymptoms.length > 0) {
        const confidence = this.calculateConfidence(
          matchedSymptoms.length,
          disease.symptoms.length,
          selectedSymptoms.length
        );

        predictions.push({
          disease,
          confidence,
          matchedSymptoms,
          timestamp: Date.now(),
        });
      }
    }

    predictions.sort((a, b) => b.confidence - a.confidence);

    return predictions.slice(0, 5);
  }

  private static calculateConfidence(
    matchedCount: number,
    totalDiseaseSymptoms: number,
    totalSelectedSymptoms: number
  ): number {
    const matchRatio = matchedCount / totalDiseaseSymptoms;
    const precisionRatio = matchedCount / totalSelectedSymptoms;
    const f1Score = (2 * matchRatio * precisionRatio) / (matchRatio + precisionRatio);
    
    const confidence = Math.round(f1Score * 100);
    
    return Math.min(confidence, 95);
  }

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
      console.error('Failed to save prediction to database, falling back to localStorage:', error);
      this.saveToLocalStorage(symptoms, result);
    }
  }

  private static saveToLocalStorage(symptoms: string[], result: PredictionResult): void {
    const history = this.getHistory();
    const newEntry: PredictionHistory = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      symptoms,
      result,
      timestamp: Date.now(),
    };

    history.unshift(newEntry);

    const limitedHistory = history.slice(0, 50);

    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
      console.error('Failed to save prediction history:', error);
    }
  }

  static getHistory(): PredictionHistory[] {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load prediction history:', error);
    }
    return [];
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear prediction history:', error);
    }
  }

  static deleteHistoryItem(id: string): void {
    const history = this.getHistory();
    const filtered = history.filter(item => item.id !== id);
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete history item:', error);
    }
  }

  static getSeverityColor(severity: Disease['severity']): string {
    switch (severity) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      case 'critical':
        return 'text-destructive';
      default:
        return 'text-foreground';
    }
  }

  static getConfidenceColor(confidence: number): string {
    if (confidence >= 70) return 'text-success';
    if (confidence >= 50) return 'text-warning';
    return 'text-destructive';
  }

  static getConfidenceBadgeVariant(confidence: number): 'default' | 'secondary' | 'destructive' {
    if (confidence >= 70) return 'default';
    if (confidence >= 50) return 'secondary';
    return 'destructive';
  }
}

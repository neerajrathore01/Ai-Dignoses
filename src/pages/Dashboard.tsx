import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Calendar, TrendingUp, Trash2, AlertCircle, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { supabase } from '@/db/supabase';
import { predictionsApi } from '@/db/api';
import type { Prediction } from '@/types/database';
import { SYMPTOMS } from '@/data/symptoms';
import { PredictionService } from '@/services/predictionService';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    mostCommonDisease: null as string | null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/login');
        return;
      }

      setUserEmail(user.email || '');

      const [predictionsData, statsData] = await Promise.all([
        predictionsApi.getUserPredictions(user.id),
        predictionsApi.getPredictionStats(user.id),
      ]);

      setPredictions(predictionsData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeletePrediction = async (predictionId: string) => {
    const success = await predictionsApi.deletePrediction(predictionId);
    
    if (success) {
      toast({
        title: 'Success',
        description: 'Prediction deleted successfully',
      });
      loadDashboardData();
    } else {
      toast({
        title: 'Error',
        description: 'Failed to delete prediction',
        variant: 'destructive',
      });
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 xl:py-12">
          <div className="mx-auto max-w-6xl">
            <Skeleton className="mb-8 h-12 w-64 bg-muted" />
            <div className="mb-8 grid gap-4 xl:grid-cols-3">
              <Skeleton className="h-32 bg-muted" />
              <Skeleton className="h-32 bg-muted" />
              <Skeleton className="h-32 bg-muted" />
            </div>
            <Skeleton className="h-96 bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-foreground xl:text-4xl">
              Health Dashboard
            </h1>
            <p className="text-muted-foreground">
              Welcome back, {userEmail}
            </p>
          </div>

          <div className="mb-8 grid gap-4 xl:grid-cols-3">
            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Predictions
                </CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">
                  All time symptom analyses
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Month
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.thisMonth}</div>
                <p className="text-xs text-muted-foreground">
                  Predictions this month
                </p>
              </CardContent>
            </Card>

            <Card className="medical-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Most Common
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.mostCommonDisease ? (
                    <span className="text-base">{stats.mostCommonDisease}</span>
                  ) : (
                    'N/A'
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Most predicted condition
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Prediction History</h2>
            <Button onClick={() => navigate('/')}>
              New Analysis
            </Button>
          </div>

          {predictions.length === 0 ? (
            <Card className="medical-card">
              <CardContent className="py-12 text-center">
                <BarChart3 className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No Predictions Yet</h3>
                <p className="mb-6 text-muted-foreground">
                  Start by analyzing your symptoms to see predictions here.
                </p>
                <Button onClick={() => navigate('/')}>
                  Analyze Symptoms
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {predictions.map((prediction) => (
                <Card key={prediction.id} className="medical-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-1 text-xl">
                          {prediction.disease_name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          {formatDate(prediction.created_at)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={PredictionService.getConfidenceBadgeVariant(prediction.confidence)}>
                          {prediction.confidence}% Confidence
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete This Prediction?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this prediction from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeletePrediction(prediction.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Symptoms Analyzed:</h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.symptoms.map(symptomId => {
                          const symptom = SYMPTOMS.find(s => s.id === symptomId);
                          return symptom ? (
                            <Badge key={symptomId} variant="outline" className="text-xs">
                              {symptom.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Matched Symptoms:</h4>
                      <div className="flex flex-wrap gap-2">
                        {prediction.matched_symptoms.map(symptomId => {
                          const symptom = SYMPTOMS.find(s => s.id === symptomId);
                          return symptom ? (
                            <Badge key={symptomId} variant="secondary" className="text-xs">
                              {symptom.name}
                            </Badge>
                          ) : null;
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Your prediction history is securely stored and only visible to you. This data helps track your health patterns over time.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </div>
  );
}

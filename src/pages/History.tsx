import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Clock, Activity, AlertCircle } from 'lucide-react';
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
import { PredictionService } from '@/services/predictionService';
import type { PredictionHistory } from '@/types/disease';
import { SYMPTOMS } from '@/data/symptoms';

export default function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<PredictionHistory[]>([]);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    const data = PredictionService.getHistory();
    setHistory(data);
  };

  const handleClearAll = () => {
    PredictionService.clearHistory();
    setHistory([]);
  };

  const handleDeleteItem = (id: string) => {
    PredictionService.deleteHistoryItem(id);
    loadHistory();
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            {history.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All History
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete all your prediction history.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearAll}>
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Clock className="h-12 w-12 text-primary xl:h-16 xl:w-16" />
              </div>
            </div>
            <h1 className="mb-2 text-3xl font-bold text-foreground xl:text-4xl">
              Prediction History
            </h1>
            <p className="text-muted-foreground">
              View your past symptom analyses and predictions
            </p>
          </div>

          {history.length === 0 ? (
            <Card className="medical-card">
              <CardContent className="py-12 text-center">
                <Activity className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">No History Yet</h3>
                <p className="mb-6 text-muted-foreground">
                  You haven't made any predictions yet. Start by analyzing your symptoms.
                </p>
                <Button onClick={() => navigate('/')}>
                  Analyze Symptoms
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card key={item.id} className="medical-card">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="mb-1 text-xl">
                          {item.result.disease.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {formatDate(item.timestamp)}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={PredictionService.getConfidenceBadgeVariant(item.result.confidence)}>
                          {item.result.confidence}% Confidence
                        </Badge>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete This Entry?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete this prediction from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteItem(item.id)}>
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
                        {item.symptoms.map(symptomId => {
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
                      <h4 className="mb-2 text-sm font-semibold">Description:</h4>
                      <p className="text-sm text-muted-foreground">
                        {item.result.disease.description}
                      </p>
                    </div>

                    <div>
                      <h4 className="mb-2 text-sm font-semibold">Key Precautions:</h4>
                      <ul className="space-y-1">
                        {item.result.disease.precautions.slice(0, 3).map((precaution, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                            <span>{precaution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {item.result.disease.requiresDoctorConsultation && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          Doctor consultation was recommended for this condition
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {history.length > 0 && (
            <div className="mt-8 text-center">
              <Button onClick={() => navigate('/')} size="lg">
                New Analysis
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

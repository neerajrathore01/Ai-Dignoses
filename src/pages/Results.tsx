import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle, ArrowLeft, CheckCircle2, Activity, AlertTriangle, FileText, Stethoscope, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { PredictionResult } from '@/types/disease';
import { PredictionService } from '@/services/predictionService';
import { SYMPTOMS } from '@/data/symptoms';

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { predictions, selectedSymptoms, uploadedImages, imageOnlyAnalysis } = location.state as {
    predictions: PredictionResult[];
    selectedSymptoms: string[];
    uploadedImages?: string[];
    imageOnlyAnalysis?: boolean;
  } || { predictions: [], selectedSymptoms: [], uploadedImages: [], imageOnlyAnalysis: false };

  useEffect(() => {
    if (!predictions || predictions.length === 0) {
      navigate('/analyze');
      return;
    }

    // Only save to history if it's not an image-only analysis
    if (predictions.length > 0 && !imageOnlyAnalysis && selectedSymptoms.length > 0) {
      PredictionService.saveToHistory(selectedSymptoms, predictions[0]);
    }
  }, [predictions, selectedSymptoms, navigate, imageOnlyAnalysis]);

  if (!predictions || predictions.length === 0) {
    return null;
  }

  const topPrediction = predictions[0];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'low':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'medium':
        return <AlertCircle className="h-5 w-5 text-warning" />;
      case 'high':
      case 'critical':
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getSeverityLabel = (severity: string) => {
    return severity.charAt(0).toUpperCase() + severity.slice(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-6">
            <Button variant="ghost" onClick={() => navigate('/analyze')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Symptom Selection
            </Button>
          </div>

          <div className="mb-8 text-center">
            <h1 className="mb-2 text-3xl font-bold text-foreground xl:text-4xl">
              {imageOnlyAnalysis ? 'Visual Analysis Results' : 'Prediction Results'}
            </h1>
            <p className="text-muted-foreground">
              {imageOnlyAnalysis 
                ? 'Based on your uploaded images, here is our preliminary analysis'
                : 'Based on your symptoms, here are the most likely conditions'}
            </p>
          </div>

          {imageOnlyAnalysis && (
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Image-Only Analysis</AlertTitle>
              <AlertDescription>
                You've uploaded images without selecting symptoms. For more accurate predictions, 
                please also select related symptoms from the symptom list. This will help our AI 
                provide better diagnosis suggestions.
              </AlertDescription>
            </Alert>
          )}

          {selectedSymptoms.length > 0 && (
            <div className="mb-6">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Your Selected Symptoms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedSymptoms.map(symptomId => {
                      const symptom = SYMPTOMS.find(s => s.id === symptomId);
                      return symptom ? (
                        <Badge key={symptomId} variant="outline">
                          {symptom.name}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {uploadedImages && uploadedImages.length > 0 && (
            <div className="mb-6">
              <Card className="medical-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ImageIcon className="h-4 w-4" />
                    Uploaded Visual Symptoms ({uploadedImages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {uploadedImages.map((imageUrl, index) => (
                      <div key={index} className="overflow-hidden rounded-lg border">
                        <img
                          src={imageUrl}
                          alt={`Visual symptom ${index + 1}`}
                          className="h-48 w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <Alert className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Visual symptom analysis is currently in beta. The prediction is primarily based on your selected symptoms.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="mb-8">
            <Card className="medical-card border-primary/50">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-2xl">
                      {topPrediction.disease.name}
                    </CardTitle>
                    <CardDescription className="text-base">
                      Most Likely Diagnosis
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(topPrediction.disease.severity)}
                    <Badge variant={PredictionService.getConfidenceBadgeVariant(topPrediction.confidence)}>
                      {getSeverityLabel(topPrediction.disease.severity)} Severity
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {!imageOnlyAnalysis && (
                  <>
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium">Confidence Score</span>
                        <span className={`text-lg font-bold ${PredictionService.getConfidenceColor(topPrediction.confidence)}`}>
                          {topPrediction.confidence}%
                        </span>
                      </div>
                      <Progress value={topPrediction.confidence} className="h-3" />
                      <p className="mt-2 text-xs text-muted-foreground">
                        Based on {topPrediction.matchedSymptoms.length} matching symptoms
                      </p>
                    </div>

                    <Separator />
                  </>
                )}

                {imageOnlyAnalysis && (
                  <>
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        This is a preliminary visual analysis. AI-powered image recognition is currently in development. 
                        The recommendations below are general guidelines for visible symptoms.
                      </AlertDescription>
                    </Alert>

                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="mb-2 flex items-center gap-2 font-semibold">
                    <FileText className="h-4 w-4" />
                    Description
                  </h3>
                  <p className="text-muted-foreground">{topPrediction.disease.description}</p>
                </div>

                <Separator />

                <div>
                  <h3 className="mb-3 flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="h-4 w-4" />
                    Precautions & Care
                  </h3>
                  <ul className="space-y-2">
                    {topPrediction.disease.precautions.map((precaution, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
                        <span className="text-sm text-muted-foreground">{precaution}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {topPrediction.disease.suggestedTests.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="mb-3 flex items-center gap-2 font-semibold">
                        <Activity className="h-4 w-4" />
                        Suggested Medical Tests
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {topPrediction.disease.suggestedTests.map((test, index) => (
                          <Badge key={index} variant="secondary">
                            {test}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {topPrediction.disease.requiresDoctorConsultation && (
                  <>
                    <Separator />
                    <Alert>
                      <Stethoscope className="h-4 w-4" />
                      <AlertTitle>Doctor Consultation Recommended</AlertTitle>
                      <AlertDescription>
                        Based on the severity and nature of your symptoms, we strongly recommend consulting
                        with a healthcare professional for proper diagnosis and treatment.
                      </AlertDescription>
                    </Alert>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {predictions.length > 1 && (
            <div>
              <h2 className="mb-4 text-xl font-semibold">Other Possible Conditions</h2>
              <div className="grid gap-4 xl:grid-cols-2">
                {predictions.slice(1).map((prediction, index) => (
                  <Card key={index} className="medical-card">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{prediction.disease.name}</CardTitle>
                        <Badge variant={PredictionService.getConfidenceBadgeVariant(prediction.confidence)}>
                          {prediction.confidence}%
                        </Badge>
                      </div>
                      <CardDescription>{prediction.disease.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <Progress value={prediction.confidence} className="h-2" />
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {getSeverityIcon(prediction.disease.severity)}
                          <span className="text-muted-foreground">
                            {getSeverityLabel(prediction.disease.severity)} Severity
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Important Disclaimer</AlertTitle>
              <AlertDescription>
                This AI-based prediction system is designed for informational purposes only and should not
                replace professional medical advice, diagnosis, or treatment. Always consult with a qualified
                healthcare provider for accurate diagnosis and appropriate treatment.
              </AlertDescription>
            </Alert>
          </div>

          <div className="mt-6 flex justify-center gap-4">
            <Button onClick={() => navigate('/')} size="lg">
              New Analysis
            </Button>
            <Button variant="outline" onClick={() => navigate('/history')} size="lg">
              View History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

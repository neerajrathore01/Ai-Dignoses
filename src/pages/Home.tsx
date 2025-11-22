import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { SYMPTOMS } from '@/data/symptoms';
import { PredictionService } from '@/services/predictionService';

export default function Home() {
  const navigate = useNavigate();
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');

  const filteredSymptoms = SYMPTOMS.filter(symptom =>
    symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedSymptoms = filteredSymptoms.reduce((acc, symptom) => {
    if (!acc[symptom.category]) {
      acc[symptom.category] = [];
    }
    acc[symptom.category].push(symptom);
    return acc;
  }, {} as Record<string, typeof SYMPTOMS>);

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptomId)
        ? prev.filter(id => id !== symptomId)
        : [...prev, symptomId]
    );
    setError('');
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0) {
      setError('Please select at least one symptom to analyze');
      return;
    }

    const predictions = PredictionService.predictDisease(selectedSymptoms);
    
    if (predictions.length === 0) {
      setError('No matching diseases found. Please try different symptoms.');
      return;
    }

    navigate('/results', { state: { predictions, selectedSymptoms } });
  };

  const clearAll = () => {
    setSelectedSymptoms([]);
    setSearchQuery('');
    setError('');
  };

  const categoryLabels: Record<string, string> = {
    general: 'General Symptoms',
    respiratory: 'Respiratory',
    neurological: 'Neurological',
    digestive: 'Digestive',
    musculoskeletal: 'Musculoskeletal',
    dermatological: 'Skin Related',
    other: 'Other Symptoms',
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 xl:py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 text-center xl:mb-12">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-primary/10 p-4">
                <Activity className="h-12 w-12 text-primary xl:h-16 xl:w-16" />
              </div>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-foreground xl:text-5xl">
              AI Disease Prediction System
            </h1>
            <p className="mx-auto max-w-2xl text-base text-muted-foreground xl:text-lg">
              Select your symptoms below and our AI-powered system will analyze them to predict potential diseases
              with confidence scores and medical recommendations.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Card className="medical-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Selected Symptoms ({selectedSymptoms.length})</span>
                {selectedSymptoms.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                )}
              </CardTitle>
              <CardDescription>
                Click on symptoms below to select them. You can select multiple symptoms.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedSymptoms.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {selectedSymptoms.map(symptomId => {
                    const symptom = SYMPTOMS.find(s => s.id === symptomId);
                    return symptom ? (
                      <Badge
                        key={symptomId}
                        variant="default"
                        className="cursor-pointer px-3 py-1.5 text-sm"
                        onClick={() => toggleSymptom(symptomId)}
                      >
                        {symptom.name}
                        <X className="ml-1.5 h-3 w-3" />
                      </Badge>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">
                  No symptoms selected. Please select symptoms from the categories below.
                </p>
              )}
              
              {selectedSymptoms.length > 0 && (
                <div className="mt-6">
                  <Button onClick={handleAnalyze} size="lg" className="w-full">
                    Analyze Symptoms
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="medical-card">
            <CardHeader>
              <CardTitle>Symptom Selection</CardTitle>
              <CardDescription>
                Search and select symptoms you are experiencing
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search symptoms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {Object.entries(groupedSymptoms).map(([category, symptoms]) => (
                  <div key={category}>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">
                      {categoryLabels[category] || category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {symptoms.map(symptom => (
                        <Badge
                          key={symptom.id}
                          variant={selectedSymptoms.includes(symptom.id) ? 'default' : 'outline'}
                          className="cursor-pointer px-3 py-1.5 text-sm transition-all hover:scale-105"
                          onClick={() => toggleSymptom(symptom.id)}
                        >
                          {symptom.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
            >
              View Prediction History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

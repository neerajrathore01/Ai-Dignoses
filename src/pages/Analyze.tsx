import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, AlertCircle, Search, X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { SYMPTOMS } from '@/data/symptoms';
import { PredictionService } from '@/services/predictionService';

interface UploadedImage {
  file: File;
  preview: string;
  compressed?: boolean;
  originalSize: number;
  finalSize: number;
}

export default function Analyze() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);

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

  // Image compression function
  const compressImage = async (file: File): Promise<{ blob: Blob; compressed: boolean }> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let { width, height } = img;

          // Resize to max 1080p while maintaining aspect ratio
          const maxDimension = 1080;
          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = (height / width) * maxDimension;
              width = maxDimension;
            } else {
              width = (width / height) * maxDimension;
              height = maxDimension;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          // Try different quality levels to get under 1MB
          let quality = 0.8;
          const tryCompress = () => {
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  if (blob.size <= 1024 * 1024 || quality <= 0.1) {
                    resolve({ blob, compressed: blob.size < file.size });
                  } else {
                    quality -= 0.1;
                    tryCompress();
                  }
                }
              },
              'image/webp',
              quality
            );
          };
          tryCompress();
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsCompressing(true);
    const newImages: UploadedImage[] = [];

    for (const file of Array.from(files)) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid File Type',
          description: `${file.name} is not an image file.`,
          variant: 'destructive',
        });
        continue;
      }

      // Validate filename (only English letters and numbers)
      const validFilename = /^[a-zA-Z0-9._-]+$/.test(file.name);
      if (!validFilename) {
        toast({
          title: 'Invalid Filename',
          description: `${file.name} contains invalid characters. Please use only English letters and numbers.`,
          variant: 'destructive',
        });
        continue;
      }

      const originalSize = file.size;
      let finalFile = file;
      let compressed = false;

      // Compress if over 1MB
      if (originalSize > 1024 * 1024) {
        try {
          const { blob, compressed: wasCompressed } = await compressImage(file);
          finalFile = new File([blob], file.name.replace(/\.[^.]+$/, '.webp'), {
            type: 'image/webp',
          });
          compressed = wasCompressed;

          if (compressed) {
            toast({
              title: 'Image Compressed',
              description: `${file.name} was automatically compressed from ${(originalSize / 1024 / 1024).toFixed(2)}MB to ${(finalFile.size / 1024 / 1024).toFixed(2)}MB`,
            });
          }
        } catch (error) {
          toast({
            title: 'Compression Failed',
            description: `Failed to compress ${file.name}. Please try a smaller image.`,
            variant: 'destructive',
          });
          continue;
        }
      }

      const preview = URL.createObjectURL(finalFile);
      newImages.push({
        file: finalFile,
        preview,
        compressed,
        originalSize,
        finalSize: finalFile.size,
      });
    }

    setUploadedImages((prev) => [...prev, ...newImages]);
    setIsCompressing(false);

    if (newImages.length > 0) {
      toast({
        title: 'Images Uploaded',
        description: `${newImages.length} image(s) uploaded successfully.`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => {
      const newImages = [...prev];
      URL.revokeObjectURL(newImages[index].preview);
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleAnalyze = () => {
    if (selectedSymptoms.length === 0 && uploadedImages.length === 0) {
      setError('Please select at least one symptom or upload an image to analyze');
      return;
    }

    const predictions = PredictionService.predictDisease(selectedSymptoms);
    
    if (predictions.length === 0) {
      setError('No matching diseases found. Please try different symptoms.');
      return;
    }

    navigate('/results', { 
      state: { 
        predictions, 
        selectedSymptoms,
        uploadedImages: uploadedImages.map(img => img.preview)
      } 
    });
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

          {/* Image Upload Section */}
          <Card className="medical-card mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Visual Symptom Detection
              </CardTitle>
              <CardDescription>
                Upload images of physical symptoms (rashes, swelling, skin conditions) to enhance analysis. 
                Maximum file size: 1MB (auto-compressed if larger).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    disabled={isCompressing}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {isCompressing ? 'Processing...' : 'Upload Images'}
                  </Button>
                  {uploadedImages.length > 0 && (
                    <Button
                      onClick={() => {
                        uploadedImages.forEach(img => URL.revokeObjectURL(img.preview));
                        setUploadedImages([]);
                      }}
                      variant="ghost"
                      className="w-full sm:w-auto"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Clear All Images
                    </Button>
                  )}
                </div>

                {uploadedImages.length > 0 && (
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {uploadedImages.map((image, index) => (
                      <div key={index} className="group relative overflow-hidden rounded-lg border">
                        <img
                          src={image.preview}
                          alt={`Uploaded symptom ${index + 1}`}
                          className="h-48 w-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-white">
                            <p className="text-sm">
                              Size: {(image.finalSize / 1024).toFixed(2)} KB
                            </p>
                            {image.compressed && (
                              <Badge variant="secondary" className="text-xs">
                                Compressed
                              </Badge>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeImage(index)}
                            >
                              <Trash2 className="mr-1 h-3 w-3" />
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {uploadedImages.length === 0 && (
                  <div className="rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center">
                    <ImageIcon className="mx-auto mb-3 h-12 w-12 text-muted-foreground/50" />
                    <p className="mb-2 text-sm font-medium text-muted-foreground">
                      No images uploaded yet
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Supported formats: JPEG, PNG, GIF, WEBP • Max size: 1MB (auto-compressed)
                    </p>
                  </div>
                )}

                {(selectedSymptoms.length > 0 || uploadedImages.length > 0) && (
                  <Button onClick={handleAnalyze} size="lg" className="w-full">
                    <Activity className="mr-2 h-5 w-5" />
                    Analyze {selectedSymptoms.length > 0 && uploadedImages.length > 0 ? 'Symptoms & Images' : selectedSymptoms.length > 0 ? 'Symptoms' : 'Images'}
                  </Button>
                )}
              </div>
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

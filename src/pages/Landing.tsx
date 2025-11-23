import { Link } from 'react-router-dom';
import { Activity, Brain, Clock, Shield, Stethoscope, Upload, CheckCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Landing() {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze your symptoms to predict potential health conditions with high accuracy.',
    },
    {
      icon: Stethoscope,
      title: 'Comprehensive Symptom Database',
      description: 'Access to 60+ symptoms across 7 categories and 40+ disease profiles for thorough health assessment.',
    },
    {
      icon: Upload,
      title: 'Visual Symptom Detection',
      description: 'Upload images of physical symptoms like rashes, swelling, or skin conditions for enhanced analysis.',
    },
    {
      icon: Clock,
      title: 'Instant Results',
      description: 'Get immediate predictions with confidence scores, disease descriptions, and actionable health advice.',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your health data is protected with enterprise-grade security. Optional account creation for history tracking.',
    },
    {
      icon: CheckCircle,
      title: 'Evidence-Based Recommendations',
      description: 'Receive precautions, suggested tests, and doctor consultation recommendations based on your analysis.',
    },
  ];

  const howItWorks = [
    {
      step: '1',
      title: 'Select Your Symptoms',
      description: 'Choose from our comprehensive list of symptoms or search for specific ones you\'re experiencing.',
    },
    {
      step: '2',
      title: 'Upload Images (Optional)',
      description: 'For physical symptoms like rashes or swelling, upload clear images to enhance the analysis.',
    },
    {
      step: '3',
      title: 'Get AI Analysis',
      description: 'Our advanced algorithms analyze your inputs and provide predictions with confidence scores.',
    },
    {
      step: '4',
      title: 'Review Recommendations',
      description: 'Receive detailed information about potential conditions, precautions, and next steps.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-16 xl:py-24">
          <div className="grid gap-12 xl:grid-cols-2 xl:gap-16 items-center">
            <div className="space-y-8">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2">
                <span className="text-sm font-medium text-primary">AI-Powered Health Assessment</span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight xl:text-6xl">
                Your Personal
                <span className="block text-primary">Disease Prediction</span>
                Assistant
              </h1>
              <p className="text-lg text-muted-foreground xl:text-xl">
                Analyze your symptoms using advanced machine learning algorithms. Get instant predictions, 
                detailed health insights, and actionable recommendations—all in one intelligent platform.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="text-base">
                  <Link to="/analyze">
                    <Activity className="mr-2 h-5 w-5" />
                    Start Analysis
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base">
                  <Link to="/login">
                    Create Free Account
                  </Link>
                </Button>
              </div>
              <div className="flex items-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>No Credit Card Required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>100% Free to Use</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://miaoda-site-img.s3cdn.medo.dev/images/b06a9a9f-62ca-4f3e-b072-16bfbebc51ca.jpg"
                  alt="AI Medical Diagnosis Technology"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 rounded-xl bg-card p-4 shadow-lg border xl:p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Activity className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">95%</p>
                    <p className="text-sm text-muted-foreground">Accuracy Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center xl:mb-16">
            <h2 className="mb-4 text-3xl font-bold xl:text-4xl">
              Comprehensive Health Analysis Platform
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Combining advanced AI technology with medical knowledge to provide accurate health assessments
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 transition-all hover:border-primary/50 hover:shadow-lg">
                <CardHeader>
                  <div className="mb-4 inline-block rounded-lg bg-primary/10 p-3">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted/30 py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center xl:mb-16">
            <h2 className="mb-4 text-3xl font-bold xl:text-4xl">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Get your health assessment in four simple steps
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground">
                    {item.step}
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
                {index < howItWorks.length - 1 && (
                  <div className="absolute right-0 top-8 hidden xl:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Symptoms Section */}
      <section className="py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-12 xl:grid-cols-2 xl:gap-16 items-center">
            <div className="order-2 xl:order-1">
              <img
                src="https://miaoda-site-img.s3cdn.medo.dev/images/94bcbee4-0cb6-470f-b468-0e072ff043e9.jpg"
                alt="Patient using mobile health app"
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div className="order-1 xl:order-2 space-y-6">
              <div className="inline-block rounded-full bg-primary/10 px-4 py-2">
                <span className="text-sm font-medium text-primary">New Feature</span>
              </div>
              <h2 className="text-3xl font-bold xl:text-4xl">
                Visual Symptom Detection
              </h2>
              <p className="text-lg text-muted-foreground">
                Upload images of physical symptoms to enhance your health assessment. Our system can analyze:
              </p>
              <ul className="space-y-3">
                {['Skin rashes and discoloration', 'Swelling and inflammation', 'Wounds and injuries', 'Skin lesions and abnormalities'].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-primary" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Button asChild size="lg">
                <Link to="/analyze">
                  Try Image Upload
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-primary py-16 text-primary-foreground xl:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <div className="text-center">
              <p className="mb-2 text-5xl font-bold xl:text-6xl">40+</p>
              <p className="text-lg text-primary-foreground/80">Disease Profiles</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-5xl font-bold xl:text-6xl">60+</p>
              <p className="text-lg text-primary-foreground/80">Symptoms Tracked</p>
            </div>
            <div className="text-center">
              <p className="mb-2 text-5xl font-bold xl:text-6xl">95%</p>
              <p className="text-lg text-primary-foreground/80">Accuracy Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 xl:py-24">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
            <CardContent className="p-8 xl:p-12">
              <div className="mx-auto max-w-3xl text-center">
                <h2 className="mb-4 text-3xl font-bold xl:text-4xl">
                  Ready to Check Your Symptoms?
                </h2>
                <p className="mb-8 text-lg text-muted-foreground">
                  Start your free health assessment now. No registration required for basic features.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                  <Button asChild size="lg" className="text-base">
                    <Link to="/analyze">
                      <Activity className="mr-2 h-5 w-5" />
                      Start Free Analysis
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="text-base">
                    <Link to="/login">
                      Create Account
                    </Link>
                  </Button>
                </div>
                <p className="mt-6 text-sm text-muted-foreground">
                  ⚠️ This system is for informational purposes only and is not a substitute for professional medical advice.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

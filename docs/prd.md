# AI-Based Disease Prediction System Requirements Document

## 1. Project Overview

### 1.1 System Name\nAI-Based Disease Prediction System

### 1.2 System Description
An intelligent healthcare system that analyzes user-reported symptoms using Machine Learning algorithms to predict potential diseases and provide basic medical advice. The system serves as a preliminary health assessment tool, similar to online symptom checkers like WebMD. Users can register accounts to track their symptom check history through a personalized dashboard.\n
### 1.3 Core Objectives
- Accept symptom inputs from users (text and image-based)
- Analyze symptoms using trained ML models
- Predict the most likely disease with confidence scores\n- Provide actionable health advice and next steps
- User authentication and profile management
- Store and display prediction history in user dashboard

## 2. System Features

### 2.1 Landing Page
- **Hero Section**: Eye-catching banner with system tagline and call-to-action buttons (Get Started, Learn More)\n- **About the System**: Detailed introduction explaining how the AI-based prediction works, its benefits, and use cases
- **Key Features Showcase**: Visual cards highlighting main features:\n  - Symptom Analysis (text and image input)
  - AI-Powered Predictions
  - Personalized Health Advice
  - Secure History Tracking
  - User Dashboard
- **How It Works**: Step-by-step visual guide (Enter Symptoms → AI Analysis → Get Results → Track History)
- **Supported Conditions**: Display of common diseases the system can predict
- **Testimonials/Trust Indicators**: User reviews or medical accuracy statistics (optional)
- **FAQ Section**: Common questions about system usage and accuracy
- **Footer**: Contact information, privacy policy, terms of service links

### 2.2 User Authentication System
- **Registration**: Email and password-based account creation
- **Login**: Secure authentication with email/password credentials
- **Password Security**: Encrypted password storage
- **Session Management**: Maintain user login state\n- **Logout**: Secure session termination

### 2.3 User Profile Management
- **User Profiles Table**: Store user information including:
  - User ID (unique identifier)
  - Email address
  - Encrypted password
  - Registration date
  - Profile information (optional: name, age, gender)\n- **Profile Access**: Users can view and update their profile information

### 2.4 Protected Dashboard
- **Access Control**: Only authenticated users can access the dashboard
- **Symptom Check History**: Display all previous symptom checks including:
  - Check date and time
  - Symptoms entered (text and uploaded images)
  - Predicted disease
  - Confidence score\n  - Advice provided
- **History Management**: View, filter, and search past predictions
- **Data Privacy**: Users can only access their own history

### 2.5 User Input System
- **Text-Based Symptom Entry**: Users can input multiple symptoms including:
  - Fever\n  - Headache
  - Body pain
  - Cough
  - Nausea
  - Joint pain
  - Rash
  - Other common symptoms\n- **Image Upload for Physical Symptoms**: Users can upload photos of visible symptoms such as:
  - Skin rashes
  - Swelling
  - Discoloration
  - Wounds or lesions
  - Eye conditions
  - Other visible physical symptoms
- **Image Processing**: Uploaded images are analyzed to detect visual symptom patterns
- **Supported Formats**: JPEG, PNG, HEIC (max file size: 10MB)
- **Input Methods**: Web-based interface (primary), with optional command-line demo\n
### 2.6 Symptom Dataset
- **Dataset Structure**: Contains symptom-disease mappings
- **Coverage**: 20-40 diseases with 10-20 symptoms each\n- **Sample Diseases**: Pneumonia, Migraine, Dengue, Diabetes, Flu, etc.
- **Data Source**: Use existing healthcare datasets or create custom dataset

### 2.7 ML Prediction Engine\n- **Text Symptom Model**: Decision Tree, Random Forest, Naive Bayes, or SVM
- **Image Analysis Model**: Convolutional Neural Network (CNN) for visual symptom detection
- **Recommended**: Random Forest or Decision Tree for categorical data handling
- **Symptom Encoding**: One-hot encoding and multi-label binary vectors\n- **Processing Flow**: Symptom input (text + images) → Binary vector conversion + Image feature extraction → ML model prediction → Result output

### 2.8 Disease Prediction Output
- **Predicted Disease**: Primary diagnosis result
- **Confidence Score**: Model accuracy percentage
- **Disease Description**: Brief explanation of the condition
- **Basic Precautions**: Immediate care recommendations
- **Suggested Tests**: Relevant medical tests (optional)
- **Doctor Consultation Flag**: Indicator for professional medical advice requirement
- **History Storage**: Automatically save prediction results (including uploaded images) to user's history

### 2.9 Optional Advanced Features
- **Chatbot System**: Step-by-step symptom inquiry through conversational interface
- **Recommendation Engine**: 
  - Doctor specialization suggestions
  - Nearby hospital information (manual entry)
- **Voice Input**: Speech-to-text symptom entry
- **Emergency Alerts**: Critical condition warnings for severe symptoms

## 3. Technical Architecture

### 3.1 System Flow
Landing Page → User Registration/Login → User Input (Text + Images) → Preprocessing → ML Model (Text + Image Analysis) → Disease Prediction → Advice Module → Output Screen → Save to History → Dashboard Display

### 3.2 Technology Stack\n- **Frontend**: HTML/CSS/JavaScript or React
- **Backend**: Python with Flask or FastAPI
- **Database**: PostgreSQL or MySQL for user profiles and history storage
- **File Storage**: AWS S3 or local storage for uploaded symptom images
- **Authentication**: JWT tokens or session-based authentication\n- **ML Libraries**: scikit-learn, pandas, numpy, TensorFlow/PyTorch (for image analysis)
- **Data Processing**: Binary encoding for symptom vectorization, image preprocessing for CNN models

### 3.3 Database Schema
\n**Users Table**:
| Field | Type | Description |
|-------|------|-------------|
| user_id | INT (Primary Key) | Unique user identifier |
| email | VARCHAR(255) | User email address |
| password_hash | VARCHAR(255) | Encrypted password |
| created_at | TIMESTAMP | Registration date |
| name | VARCHAR(100) | User name (optional) |
| age | INT | User age (optional) |
| gender | VARCHAR(20) | User gender (optional) |
\n**Prediction History Table**:\n| Field | Type | Description |
|-------|------|-------------|
| history_id | INT (Primary Key) | Unique history record ID |
| user_id | INT (Foreign Key) | Reference to Users table |
| check_date | TIMESTAMP | Date and time of symptom check |\n| symptoms | TEXT | JSON array of entered symptoms |
| uploaded_images | TEXT | JSON array of image file paths |
| predicted_disease | VARCHAR(100) | Predicted disease name |
| confidence_score | FLOAT | Model confidence percentage |\n| advice | TEXT | Provided medical advice |
| suggested_tests | TEXT | Recommended tests|\n
### 3.4 Symptom Data Structure Example\n| Fever | Cough | Rash | Headache | Disease |
|-------|-------|------|----------|----------|\n| 1 | 1 | 0 | 0 | Flu |
| 0 | 0 | 1 | 1 | Dengue |

## 4. Output Report Format

**Example Display**:
- Predicted Disease: Dengue
- Model Accuracy: 92%
- Advice:\n  - Drink ORS\n  - Take adequate rest
  - Avoid painkillers like ibuprofen
- Tests Suggested: Platelet count, CBC
- Doctor Consultation: Recommended
- Uploaded Images: [Display thumbnails of uploaded symptom photos]

## 5. Design Style

- **Color Scheme**: Clean medical theme with primary colors of soft blue (#4A90E2) and white, accented with warning red (#E74C3C) for critical alerts
- **Landing Page Layout**: Full-width hero section with background gradient, feature cards in3-column grid layout, alternating content sections with images and text
- **Layout**: Card-based interface with clear section separation for symptom input, image upload area with drag-and-drop functionality, prediction results, advice panels, and dashboard history table\n- **Visual Elements**: Rounded corners (8px radius) for all containers, subtle shadows for depth, medical-themed icons for symptoms and diseases, user profile avatar in navigation bar, image preview thumbnails with zoom capability
- **Typography**: Sans-serif font (Roboto or Inter) for readability, with clear hierarchy between headings and body text
- **Interactive Elements**: Smooth transitions on button clicks, progress indicators during prediction processing and image upload, color-coded confidence scores (green for high, yellow for medium, red for low confidence), hover effects on history records, image gallery lightbox for viewing uploaded symptom photos
- **Dashboard Layout**: Tabular view for history with sortable columns, filter options by date range and disease type, pagination for large datasets, thumbnail previews of uploaded images in history records
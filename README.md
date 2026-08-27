# triNETRA 👁️
### A Comprehensive Disaster Response Coordination & Dispatch Platform

TriNetra transforms fragmented disaster reports (voice, photo, text) into structured, prioritized, and explainable response missions. It is built as a **dual-platform system**:
1. **React Native Mobile App**: For Citizens and Volunteers on the ground.
2. **React Web Command Center**: For Coordinators to triage and dispatch resources.

## 🌟 The Problem We Solve
During disasters, information is scattered and unstructured. Nearest-is-not-best dispatch sends the wrong tools to the job. TriNetra closes this gap by structuring information via AI, scoring urgency deterministically, filtering responders on hard requirements (not just proximity), and keeping a human coordinator in the loop.

## 🚀 Key Features

### 1. Offline Voice Distress (Silent SOS)
Citizens can trigger emergency alerts entirely offline using their voice. We implemented **react-native-vosk** for on-device, offline keyword spotting. Simply saying "Help", "Emergency", or "Bachao" triggers a background SOS sequence that alerts the Command Center instantly without needing to unlock the phone or press buttons.

### 2. Live Crash-Free Interactive Mapping (Leaflet)
Unlike traditional native maps that crash without paid Google API keys or under memory pressure, TriNetra implements **Leaflet via React Native WebView**. This provides a fully interactive, lightweight, crash-free map experience across both iOS and Android. 
- Volunteers see live dynamic routes to Citizens.
- Coordinators see a global dashboard of all active incidents, volunteers, and emergency shelters.

### 3. Role-Based Dynamic Dashboards
The platform dynamically alters its UI based on the user's role (enforced via Supabase RLS and Auth):
- **Citizens**: Access report tools (Photo, Audio, Triage), nearby shelters, and persistent Medical Profiles.
- **Volunteers**: Access a standby radar that pops up "Self-Assign" missions when nearby SOS alerts are triggered.
- **Coordinators**: Access a Web-based Command Center to monitor live telemetries, approve dispatches, and place emergency shelters on the map.

### 4. Supabase Backend Integration
- **Realtime DB**: Incident updates broadcast instantly to the Volunteer radar and Coordinator web panel.
- **Storage**: Citizen photo reports are safely uploaded to Supabase buckets.
- **Auth & RLS**: Secure Row Level Security ensures citizens can only edit their own Medical Profiles, while coordinators have elevated read/write access.

## 🛠️ Technology Stack
- **Mobile Frontend:** React Native (Expo)
- **Web Frontend:** React 18 + TypeScript + Vite + Tailwind CSS
- **Backend & Database:** Supabase (PostgreSQL, Realtime, Storage, Auth)
- **Mapping:** Leaflet & OpenStreetMap (react-leaflet for Web, react-native-webview for Mobile)
- **Offline Voice AI:** Vosk (react-native-vosk)
- **CI/CD:** GitHub Actions optimized for Android APK builds with strict OOM prevention.

## 🏃‍♂️ Getting Started

### 1. Running the Web Command Center (Coordinator Panel)
The web app is located in the root directory.
```bash
npm install
npm run dev
```
Navigate to `http://localhost:5173`. 

### 2. Running the Mobile App (Citizens & Volunteers)
The mobile app is located in the `/mobile` directory.
```bash
cd mobile
npm install
npx expo start
```
Use the Expo Go app or an Android Emulator to run the app.

### 3. Creating Test Users
By default, new signups are given the `citizen` role. To test Volunteer or Coordinator workflows, run the provided setup scripts in the root directory to inject users into your Supabase database:
```bash
node create_coordinator.js   # Creates coordinator2@demo.com
node create_test_users.js    # Creates additional test accounts
```

## 🏗️ Automated APK Builds
TriNetra features a fully configured GitHub Action to build Android APKs on push. To avoid GitHub Runner Out-Of-Memory (OOM) failures, our Gradle build is highly optimized:
- Restricted to single-architecture builds (`armeabi-v7a`) for testing.
- `org.gradle.jvmargs` limited to 1.5GB.
- Reduced worker count.

## 🎨 Design System
TriNetra uses a highly accessible, premium design system. It heavily utilizes high-contrast colors, large touch targets, and legible typography to ensure operability under stress and poor lighting conditions.

## 📄 License
This project is licensed under the MIT License.

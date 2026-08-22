# triNETRA 👁️
### A Mobile-First, Capability-Aware Disaster Response Coordination & Dispatch Platform

TriNetra transforms fragmented disaster reports (text, voice, photo) into structured, prioritized, and explainable response missions. It answers the core operational question during a crisis: **who needs help first, what exactly do they need, and which available responder can safely and quickly meet that need?**

## 🌟 The Problem We Solve
During disasters, information is scattered and unstructured. Nearest-is-not-best dispatch sends the wrong tools to the job. TriNetra closes this gap by structuring information via AI, scoring urgency deterministically, filtering responders on hard requirements (not just proximity), and keeping a human coordinator in the loop.

## 🚀 Key Features

### 1. Citizen SOS & AI Extraction
Citizens can report emergencies rapidly. TriNetra uses Google's Gemini AI to parse unstructured free-form text and extract structured incident data (number of people, medical urgency, hazards, required capabilities) instantly.

### 2. Smart, Capability-Aware Dispatch
Instead of just pinging the closest person, TriNetra's rules engine filters volunteers by what they can actually do. If an incident involves rising water, only volunteers with boats or water-rescue training are notified.

### 3. Coordinator Command Dashboard
Coordinators get a live, triage-sorted view of all incidents. The system calculates an "Urgency Score" and recommends the best volunteer matches, allowing the coordinator to approve or override dispatches with full explainability.

### 4. Real-time Mission Tracking
Once dispatched, volunteers can accept/decline missions, view offline maps, and update their status (En Route, On Scene, Resolved). Citizens receive live updates on their SOS status.

## 🛠️ Technology Stack
- **Frontend Framework:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 (Mobile-first, high contrast "Tactical Accessibility Engine")
- **Backend & Database:** Firebase (Cloud Firestore, Authentication)
- **AI Integration:** Firebase AI / Google Gemini (for natural language extraction)
- **Routing:** React Router v6

## 🏃‍♂️ Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Start Development Server:**
   ```bash
   npm run dev
   ```

3. **Build for Production:**
   ```bash
   npm run build
   ```

## 🎨 Design System
TriNetra uses a highly accessible, premium dark-mode design system. It heavily utilizes high-contrast colors (Obsidian Black, Safety Orange, Electric Cyan), large touch targets (min 48px), and legible typography (Plus Jakarta Sans) to ensure operability under stress and poor lighting conditions.

## 📄 License
This project is licensed under the MIT License.

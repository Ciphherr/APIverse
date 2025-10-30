# APIVerse 🚀

**APIVerse** is a developer‐first platform that automatically generates interactive API documentation, language-specific SDKs, and provides AI-powered assistance to help developers understand and test APIs easily. It simplifies API adoption by combining documentation, SDK generation, and live testing in one unified interface.

## ✨ Features

- 🔍 **Interactive API Documentation** — Automatically generate engaging API docs for your services.  
- 🧰 **SDK Generation** — Produce language-specific SDKs (e.g., JavaScript, Python, etc.) for consumption of your APIs.  
- 🧠 **AI-Powered Assistance** — Offer guidance, suggestions or example usage for APIs using AI.  
- 🧪 **Live API Testing & Playground** — Developers can try endpoints, set headers, bodies and inspect responses directly within the platform.  
- 📂 **Unified Interface** — Everything in one place: discovery, documentation, testing and SDKs.

## 🏗️ Tech Stack

- **Backend**: Node.js, Express  
- **Frontend**: React, tailwindcss (via Vite)  
- **Database**: MongoDB    
- **SDK Generation**: openapi sdk generator
- **AI Assistance**: (e.g., OpenAI API, or other LLM integration)  
- **Version Control**: Git & GitHub

> *Adjust the above to match your actual stack details if some differ.*

## 🛠️ Getting Started

### Prerequisites  
- Node.js (v14+ recommended)  
- npm or yarn  
- MongoDB instance (local or cloud)  
- Optionally: API key for AI service if using one  

### Installation & Setup  
```bash
# Clone the repository
git clone https://github.com/Ciphherr/APIverse.git
cd APIverse

# Setup backend
cd Backend
npm install
# configure environment variables (.env file): e.g., DB_URI, JWT_SECRET, AI_API_KEY
nodemon server.js

# Setup frontend
cd ../Frontend
npm install
npm run dev

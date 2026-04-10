# College Selector: Your Personalized AI Admissions Suite

> [!TIP]
> **Production Ready**: This application has been modernized from a monolithic legacy system into a modular, high-performance React + Vite suite designed for Kaylani’s college journey.

An AI-powered "Decision HQ" that helps students discover, score, and evaluate colleges using data-driven insights and a personalized AI Advisor.

---

## 🚀 Key Features

### 📋 Smart Dashboard

- **Actionable Agenda**: Automatically identifies your next top 3 priorities.
- **Dynamic Scoring**: Real-time "Fit Score" based on your weighted priorities (Cost, Academics, Vibe).
- **Financial Spotlight**: See your personalized "Net Cost" after aid and scholarships.

### 🤖 AI Advisor

- **24/7 Coaching**: Ask questions about specific schools, admission chances, or campus life.
- **Context-Aware**: The AI sees your whole profile (GPA, SAT, ECs) to give tailored advice.
- **Web Intelligence**: Search for the latest 2025 news and admission trends.

### ✍️ Essay Workshop

- **Brainstorming**: Turn your experiences into compelling narrative hooks.
- **Drafting & Feedback**: Get structural feedback and "Story Strength" scores on your drafts.

### 💰 Scholarship Manager

- **Aid Tracking**: Link scholarships directly to schools to see immediate financial impact.
- **Renewal Alerts**: Track which awards are one-time vs. renewable.

---

## 🏗️ Architecture

The application is built on a modular, scalable React foundation:

- **State Management**: Centralized `AppContext` utilizing `useReducer` and persistent hooks.
- **UI System**: A bespoke, "Premium Aesthetic" design system using Vanilla CSS variables and Lucide-react.
- **Services**: Autonomous AI service layer for Anthropic Claude integration.

### Directory Map

- `src/features/`: Domain-specific business logic (Ex: `Scholarships.jsx`).
- `src/components/`: Reusable, atomic UI elements (Ex: `Button.jsx`).
- `src/context/`: Global state and data calculations.
- `src/services/`: External API integrations.

---

## 🛠️ Development

### Setup

```bash
npm install
npm run dev
```

### 107+ Ported Skills

This project utilizes a library of over **107 specialized skills** ported from Claude Code. For a full list of available AI capabilities, see the [Skills Master Index](.gemini/antigravity/brain/4e1e6d87-f5b1-49fe-9b42-4d2502ccbddd/skills_master_index.md).

---

## 🛡️ Security & Privacy

- **Client-Side First**: Your school data and profile are stored locally in your browser.
- **API Security**: Your API keys are never stored on a server; they remain in your local session.

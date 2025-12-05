# todai - The Smartest To-Do List 🧠✨

**A Billion Dollar Design Experiment in Productivity.**
[**View Live Demo**](https://Jacob-Mounir.github.io/todai)

![Todai App](https://via.placeholder.com/800x400?text=Todai+App+Screenshot)

## 🚀 The Vision

**todai** isn't just a todo list. It's an intelligent task manager that understands you.
Using a personal "User Context", it automatically sorts your chaotic brain dump into actionable buckets:
-   **Today**: Urgent, critical, do-it-now tasks.
-   **Tomorrow**: Planned work for the near future.
-   **Future**: Ideas, dreams, and backlog items.

> "Stop organizing. Start doing."

---

## ✨ Key Features

-   **🧠 Smart Sort Engine**: Powered by **Google Gemini AI** (with a seamless local fallback) to intelligently categorize tasks based on your persona.
-   **💎 Premium "Glass" UI**: A stunning, multi-billion dollar aesthetic featuring deep mesh gradients, frosted glassmorphism, and fluid animations.
-   **⚡️ Instant Offline Mode**: The deployed demo runs 100% in the browser using a smart heuristic engine if the backend is unreachable.
-   **🤖 Context-Awareness**: It differentiates between "Work" (e.g., Client emails) and "Personal" (e.g., Mom's birthday) automatically.
-   **🎧 Focus Deck**: Built-in Pomodoro Timer and LoFi Music player to help you execute tasks.
-   **⏱️ Smart Estimates**: AI-predicted task duration to help you plan your day.

---

## 🛠️ Tech Stack

-   **Frontend**: React + Vite (Fast, Modern)
-   **Styling**: Tailwind CSS v3 + Framer Motion (Animations)
-   **Backend**: Node.js + Express (API Layer)
-   **AI**: Google Generative AI SDK (Gemini 1.5 Flash)

---

## 🚀 Getting Started (Local Development)

To run the full stack experience with the real AI backend:

### 1. Clone the Repo
\`\`\`bash
git clone https://github.com/Jacob-Mounir/todai.git
cd todai
\`\`\`

### 2. Setup Server (Backend)
\`\`\`bash
cd server
npm install
# Create a .env file with your Gemini Key:
# GEMINI_API_KEY=your_key_here
node index.js
\`\`\`

### 3. Setup Client (Frontend)
\`\`\`bash
cd client
npm install
npm run dev
\`\`\`

Visit `http://localhost:5173` and enjoy!

---

## 🌐 Live Demo (GitHub Pages)

The live demo runs in **"Client-Only Smart Mode"**.
Because GitHub Pages handles static sites, the Node.js backend is bypassed. Instead, the app uses a powerful local logic engine to simulate the AI, ensuring the "Auto-Organize" feature works instantly for everyone, everywhere.

[**Try the Demo**](https://Jacob-Mounir.github.io/todai)

---

## 👨‍💻 Created By

**Jacob Mounir**
*Building for the future.*

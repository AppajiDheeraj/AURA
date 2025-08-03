# Aura — Your Personal AI Command Center

Aura is a multimodal, voice-first AI assistant designed to be your personal command center. It provides an intelligent, responsive interface to control your computer, access real-time information, and even understand the world through visual input.

The platform integrates low-latency voice communication, advanced AI function calling, and a sleek, futuristic frontend to create an immersive and powerful user experience.

<p align="center">
  <img src="https://raw.githubusercontent.com/dheeraj-appaji/AURA/main/frontend/public/AURA.png" width="150" alt="Aura Logo" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/AI-Assistant-blueviolet?style=for-the-badge&logo=OpenAI&logoColor=white" alt="AI Assistant Badge"/>
  <img src="https://img.shields.io/badge/Multimodal-Vision-blue?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0id2hpdGUiPjxwYXRoIGQ9Ik0xMiA0LjVDNyAyLjUgMiA3IDIgMTJzNSA5LjUgMTAgOS41czEwLTQuNSAxMC05LjVTMTcgMi41IDEyIDQuNVpNMTIgMTdjLTIuNzYgMC01LTIuMjQtNS01czIuMjQtNSA1LTUgNSAyLjI0IDUgNS0yLjI0IDUtNSA1Wm0wLTdjLTEuMSAwLTItLjg5LTMtMnMtLjg5LTItMi0yIDAtMi4yNCAwLTIuMjRaIi8+PC9zdmc+&logoColor=white" alt="Multimodal Vision Badge"/>
  <img src="https://img.shields.io/badge/LiveKit-Agent-green?style=for-the-badge&logo=livekit&logoColor=white" alt="LiveKit Agent Badge"/>
  <img src="https://img.shields.io/badge/Frontend-Next.js-black?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge"/>
  <img src="https://img.shields.io/badge/Backend-Python-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python Badge"/>
</p>

---

## 🎯 Key Features

-   **Multimodal AI Core:** Powered by GPT-4o, Aura understands commands from both voice and (soon ) visual input from your camera.
-   **Comprehensive System Control:** Launch applications, manage system volume and brightness, and execute power controls (shutdown, restart, sleep).
-   **Real-Time Information Hub:** Instantly fetch live weather, news headlines, stock prices, and search results from the web.
-   **Seamless Communication:** Send emails via Gmail and messages via WhatsApp using natural voice commands and a stored contact list.
-   **Advanced AI Stack:** Utilizes best-in-class services for Speech-to-Text (Deepgram), Language Model (OpenAI), and Text-to-Speech (ElevenLabs).
-   **Futuristic UI:** A responsive and dynamic user interface built with Next.js, featuring a reactive agent "orb" and an animated background.
-   **Voice-First Interaction:** Built on the LiveKit Agents framework for robust, low-latency, real-time audio conversations.

---

## 🧑‍💻 Tech Stack

| Component          | Technology/Service                                                                                             |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| **Framework**      | Next.js (React)                                                                                                |
| **AI Agent SDK**   | LiveKit Agents                                                                                                 |
| **Language Model** | OpenAI (GPT-4o)                                                                                                |
| **Speech-to-Text** | Deepgram (Nova-2)                                                                                              |
| **Text-to-Speech** | ElevenLabs                                                                                                     |
| **Styling**        | Tailwind CSS, shadcn/ui, Framer Motion                                                                         |
| **Real-Time Comms**| LiveKit                                                                                                        |
| **Backend**        | Python                                                                                                         |

---

## 📸 Screenshots
<p align="center"><img src="https://raw.githubusercontent.com/dheeraj-appaji/AURA/main/frontend/public/demo.gif" alt="Aura Demo GIF"/> </p> 
<table> 
  <tr> 
    <td align="center"><strong>Welcome Screen</strong></td> 
    <td align="center"><strong>Session View</strong></td> 
  </tr> 
  <tr> 
    <td width="50%"><img src="https://raw.githubusercontent.com/dheeraj-appaji/AURA/main/frontend/public/welcome.png" alt="Aura Welcome Screen" /></td> 
    <td width="50%"><img src="https://raw.githubusercontent.com/dheeraj-appaji/AURA/main/frontend/public/session.png" alt="Aura Session Interface" /></td> 
  </tr> 
</table>

---

## 🚀 Getting Started

The project is divided into two main parts: `backend` and `frontend`.

### Backend Setup (The AI Agent )

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a virtual environment:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```

3.  **Install dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Configure Environment Variables:**
    Create a `.env` file in the `backend/` directory and add your API keys:
    ```env
    # .env (in backend/)
    LIVEKIT_URL=wss://your-project.livekit.cloud
    LIVEKIT_API_KEY=your_api_key
    LIVEKIT_API_SECRET=your_api_secret

    OPENAI_API_KEY=your_openai_key
    ELEVENLABS_API_KEY=your_elevenlabs_key
    ELEVENLABS_VOICE_ID=your_elevenlabs_voice_id
    DEEPGRAM_API_KEY=your_deepgram_key
    
    # Optional for information tools
    WEATHER_API_KEY=your_openweathermap_key
    NEWS_API_KEY=your_newsapi_key
    ```
5.  **Google API Setup:**
    - Download your `credentials.json` file from the Google Cloud Console and place it in the `backend/` directory.
    - The first time you run a Gmail command, you will be prompted to authenticate in your browser. This will create a `token.json` file.

6.  **Run the Agent Worker:**
    ```bash
    python main.py dev
    ```

### Frontend Setup (The Web App)

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies (using npm):**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    Copy `.env.example` to `.env.local` and add your LiveKit credentials. These are used to generate a token for the user to join the room.
    ```env
    # .env.local (in frontend/)
    LIVEKIT_API_KEY=your_livekit_api_key
    LIVEKIT_API_SECRET=your_livekit_api_secret
    LIVEKIT_URL=wss://your-project.livekit.cloud
    ```

4.  **Start the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000 ) in your browser to begin a session.

---

## 📁 Project Structure

```
AURA/
├── backend/
│   ├── tools/              # All Python tool definitions (system, web, etc.)
│   ├── jarvis_agent.py     # The core agent class, instructions, and tool registration
│   ├── main.py             # Entrypoint to run the LiveKit agent worker
│   ├── contacts.json       # User's contact list for WhatsApp/Email
│   ├── requirements.txt    # Python dependencies
│   └── .env                # Backend API keys (gitignored)
│
└── frontend/
├── app/                # Next.js App Router (pages, layouts, API routes)
├── components/         # React components (UI, LiveKit controls)
├── hooks/              # Custom React hooks for LiveKit
├── lib/                # Utility functions and type definitions
├── public/             # Static assets (images, fonts)
├── app-config.ts       # App branding and feature configuration
├── package.json        # Frontend dependencies and scripts
└── .env.local          # Frontend environment variables (gitignored)
```

---

## 🤝 Contributing

Contributions are welcome! If you have ideas for improvements or want to fix a bug, please feel free to open an issue or submit a pull request.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 👨‍💻 Author

Made with 💙 by Dheeraj Appaji.

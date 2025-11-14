# NurseEasy Ai

https://nurseeasy-ai.vercel.app/ 
(If we dont win the hackathon im going to kill the backend service so it wont work anymore but I'll keep the vercel service running)


Overall Demo: done by Daksh

https://github.com/user-attachments/assets/e3e759a8-6bf9-497e-8cab-43bf51086bee

Error Catch Demo: done by Daksh

https://github.com/user-attachments/assets/50e0e5a4-d6e9-4e0d-a1ba-ba352416a034

NurseEasy AI turns spoken audio into clear nursing notes using a simple browser-based recorder and cloud AI. It works on any modern phone or computer with no downloads.

---

## How It Works (Works on all browsers, desktop or mobile)

1. The user records audio directly in the browser.
2. Audio is chunked and sent to the backend for transcription using Whisper.
3. Transcripts update in real time on the frontend.
4. The user selects a note format (SOAP, Lifestyle, or AI Insight).
5. The full transcript is sent to GPT to generate a structured clinical note.
6. The results are displayed on the frontend for copying or saving.

---

## Technologies Used

### Frontend
- React
- Typscript
- TailwindCSS
- Framer Motion
- MediaRecorder API

### Backend
- Node.js
- Express
- Multer (memory storage) lol
- Whisper-1 API (OpenAI)
- GPT 4o mini API (OpenAPI)

### Deployment
- Vercel (frontend)
- Render (backend) 
- Only conifgured to handle 20-30 users at the same time. For now.

# Current Costs and Architecture
- Open API costs : $0.50 CAD per Hour of recording
- Hosting: 3 dollar/month (will be more expensive if scaled)
                           
                           ┌──────────────────────────────┐
                           │          FRONTEND            │
                           │    React + TS + Vite         │
                           │  Tailwind + Framer Motion    │
                           └──────────────┬───────────────┘
                                          │
                       Audio Recording (MediaRecorder API)
                                          │
                                          ▼
                           ┌──────────────────────────────┐
                           │        API Manager (FE)      │
                           │  Sends audio → backend via   │
                           │   multipart/form-data        │
                           └──────────────┬───────────────┘
                                          │
                                          ▼
                    ┌───────────────────────────────────────────┐
                    │                 BACKEND     
                    │           In memory FIFO queue system (temporary for hack)
                    │             Express + Node                │
                    │   Multer (memory) for file uploads        │
                    └──────────────┬───────────────┬────────────┘
                                   │               │
                    Chunked Audio Upload     Note Generation Request
                                   │               │
                                   ▼               ▼
                    ┌─────────────────┐   ┌────────────────────────┐
                    │   Whisper API   │   │      GPT (Chat API)    │
                    │  Speech-to-Text │   │ Generates structured   │
                    │  transcript text│   │ notes based on features│
                    └──────────┬──────┘   └───────────────┬────────┘
                               │                          │
                               └──────────┬───────────────┘
                                          ▼
                             FE receives JSON:
                           { transcript, generatedNotes }
                                          ▼
                           Displayed in UI as structured
                           nursing documentation

const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OpenAI = require("openai");
const { toFile } = require("openai/uploads"); 
require("dotenv").config();

const app = express();
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});
app.use(cors({ origin: [ process.env.FRONTEND_URL] }));
console.log(process.env.FRONTEND_URL)

let queue = [];
let processing = false;

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;

  const { file, res } = queue.shift();

  try {
    console.log("Sending to Whisper:", {
      name: file.originalname,
      type: file.mimetype,
      size: file.size,
    });


    const filename = file.originalname && file.originalname.includes(".")
      ? file.originalname
      : "audio.webm";

    // convert multer buffer -> proper file-like object 
    const whisperFile = await toFile(file.buffer, filename);

    const result = await client.audio.transcriptions.create({
      file: whisperFile,
      model: "whisper-1",        
      response_format: "text",
    });

    console.log("Whisper result:", result);

    res.json({ success: true, transcript: result });

  } catch (err) {
    console.error("Whisper error:", err);
    res.status(500).json({ success: false, error: err.message });
  } finally {
    processing = false;
    processQueue();
  }
}

app.post("/upload-audio", upload.single("audio"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  queue.push({ file: req.file, res });
  processQueue();
});

app.post("/generate-notes", async (req, res) => {
  try {
    const { transcript, features } = req.body;

    console.log("Received transcript:", transcript);
    console.log("Received features:", features);

    if (!transcript || !features) {
      return res.status(400).json({ error: "Missing transcript or features" });
    }

    const prompt = `
      You are a nursing documentation assistant.
      Generate clear, professional nursing notes based ONLY on the transcript and requested features.

      IMPORTANT:
      - DO NOT use markdown (no **bold**, no # headers).
      - Simulate bolding ONLY using ASCII characters like:
        === SECTION TITLE ===
        -- Subsection --
        [Label]
      - Use \\n for new lines.
      - Use bullet points using "-" only.
      - Keep tone clinical and concise.
      - Organize the notes into sections depending on features.
      - If any transcripts feel out of place you remove them as they might be a transcription error

      Transcript:
      ${transcript}

      Requested Features:
      ${features.join(", ")}

      Now generate formatted nursing notes as a plain string.
      Return ONLY the notes. No explanations, no extra wording.
    `;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",      // cheapest model lol
      messages: [
        { role: "system", content: "You generate nursing notes from dictation." },
        { role: "user", content: prompt }
      ],
      temperature: 0.3,
    });

    const notes = completion.choices[0].message.content;

    console.log("Generated notes:", notes);

    res.json({ success: true, notes });

  } catch (err) {
    console.error("Error in /generate-notes:", err);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(3001, () => console.log("Server running at http://localhost:3001"));

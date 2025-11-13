const express = require("express");
const multer = require("multer");
const cors = require("cors");
const OpenAI = require("openai");
const { toFile } = require("openai/uploads"); 
require("dotenv").config();

const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));

const upload = multer({ storage: multer.memoryStorage() });

const client = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
});

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

app.listen(3001, () => console.log("Server running at http://localhost:3001"));

const express = require('express');
const multer = require('multer');
const cors = require('cors');

const corsOptions = {
  origin :['http://localhost:5173']
};
require('dotenv').config();
const OpenAi = require('openai');

const app = express();
app.use(cors(corsOptions));
const PORT = 3001;
const storage = multer.memoryStorage();
const upload = multer({storage})

const openai = new OpenAi({
  apiKey: process.env.OPEN_API_KEY
})

console.log(process.env.OPEN_API_KEY);

queue = []
let processing = false;

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;

  const {file, res} = queue.shift();

  try {

    // open ai api call and get thetranscript 
    const result = await openai.audio.transcriptions.create({
      file: {
        buffer: file.buffer,
        mimetype: file.mimetype,
        filename: file.originalname || "audio.webm"
      },
      model: "whisper-1",       
      prompt: "This is nursing documentation. Transcribe clearly.",
      response_format: "text"
    });
    const transcript = result.trim();
    console.log("Whisper transcription:", transcript);
    
    res.json({success:true, transcript});

  }catch (error){
    console.log(error);
    res.status(500).json({success: false, error: "Processing failed"})
  } finally {
    processing = false;
    processQueue();
  }

}


app.post('/upload-audio', upload.single("audio"), async(req, res)=> {
  if (!req.file) return res.status(400).json({error: "No file uploaded"});

  queue.push({file: req.file, res})

  console.log("Added file to queue:", {
  originalname: req.file.originalname,
  mimetype: req.file.mimetype,
  size: req.file.size,
  queuelength : queue.length
  });


  processQueue();

})


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
const express = require('express');
const multer = require('multer');
const cors = require('cors');
const corsOptions = {
  origin :['http://localhost:5173']
};

const app = express();
app.use(cors(corsOptions));
const PORT = 3001;
const storage = multer.memoryStorage();
const upload = multer({storage})


queue = []
let processing = false;

async function processQueue() {
  if (processing || queue.length === 0) return;
  processing = true;

  const {file, res} = queue.shift();

  try {
    // open ai api call and get thetranscript 
    transcript = "open ai touched";
    res.json({sucess:true, transcript});
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
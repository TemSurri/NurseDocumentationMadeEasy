const express = require('express');
const multer = require('multer');
const cors = require('cors');
const corsOptions = {
  origin :['http://localhost:5173']
};

const app = express();
app.use(cors(corsOptions));
const PORT = 3001;
const upload = multer({dest:"uploads"});

app.post('/upload-audio', upload.single("audio"), async(req, res)=> {

  res.json({req : req.file , transcript : "This is a fake transcription for testing"})
  
})


app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
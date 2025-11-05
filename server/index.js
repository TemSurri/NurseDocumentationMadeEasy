const express = require('express');

const cors = require('cors');
const corsOptions = {
  origin :['http://localhost:5173']
};

const app = express();
app.use(cors(corsOptions));
const PORT = 3001;




app.get("/api", (req, res) => {
  res.json({notes: "hello money man"})
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
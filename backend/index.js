const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

app.get("/hello", (req, res) => {
  res.send("Hello from the backend!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors");

// Route imports
const transcribeRoutes = require("./routes/transcribeRoutes");
const ttsRoutes = require("./routes/ttsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// Basic Hello Endpoint
app.get("/hello", (req, res) => {
  res.send("Hello from the backend!");
});

// Use Routes
app.use("/", transcribeRoutes);
app.use("/", ttsRoutes);
app.use("/", uploadRoutes);

module.exports = app;

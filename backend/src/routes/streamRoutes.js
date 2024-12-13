const express = require("express");
const router = express.Router();
const {
  transcribeStreaming,
} = require("../services/transcribeStreamingService");

router.post("/stream-transcription", async (req, res) => {
  try {
    const audioStream = req; // The incoming request acts as a readable stream
    const transcription = await transcribeStreaming(audioStream);
    res.send(transcription);
  } catch (error) {
    console.error("Error in /stream-transcription route:", error.message);
    res.status(500).send("Streaming transcription failed.");
  }
});

module.exports = router;

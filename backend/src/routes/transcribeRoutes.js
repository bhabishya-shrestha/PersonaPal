const express = require("express");
const router = express.Router();
const {
  startTranscriptionJob,
  getTranscriptionStatus,
  getTranscriptText,
} = require("../controllers/transcribeController");

// Start transcription job
router.post("/transcribe", startTranscriptionJob);

// Check transcription job status
router.get("/transcription-status/:jobName", getTranscriptionStatus);

// Fetch transcript text from S3
router.get("/transcription-result/:jobName", getTranscriptText);

module.exports = router;

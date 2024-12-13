const express = require("express");
const router = express.Router();
const {
  startTranscriptionJob,
  getTranscriptionStatus,
  getTranscriptText,
  listFilesInS3, // Ensure this import exists
} = require("../controllers/transcribeController");

// Start transcription job
router.post("/transcribe", startTranscriptionJob);

// Check transcription job status
router.get("/transcription-status/:jobName", getTranscriptionStatus);

// Fetch transcript text from S3
router.get("/transcription-result/:jobName", getTranscriptText);

// List files in the S3 bucket
router.get("/list-files", listFilesInS3);

module.exports = router;

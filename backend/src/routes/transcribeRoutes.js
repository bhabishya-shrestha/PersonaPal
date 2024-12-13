const express = require("express");
const router = express.Router();
const {
  startTranscriptionJob,
  getTranscriptionStatus,
  getTranscriptText,
  listFilesInS3,
  streamTranscription, // Import the new controller
} = require("../controllers/transcribeController");
const {
  handleStreamingTranscription,
} = require("../controllers/transcribeStreamingController");

// Start transcription job
router.post("/transcribe", startTranscriptionJob);

// Check transcription job status
router.get("/transcription-status/:jobName", getTranscriptionStatus);

// Fetch transcript text from S3
router.get("/transcription-result/:jobName", getTranscriptText);

// List files in the S3 bucket
router.get("/list-files", listFilesInS3);

// Stream transcription
router.post("/stream-transcription", streamTranscription); // Add the route

router.post("/stream-transcription", handleStreamingTranscription);

module.exports = router;

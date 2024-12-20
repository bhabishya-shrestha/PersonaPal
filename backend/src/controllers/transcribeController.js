const { startJob, getJobStatus } = require("../services/transcribeService");
const {
  fetchTranscriptFromS3,
  listFilesInBucket,
} = require("../services/s3Service");
const {
  transcribeAudioStream,
} = require("../services/transcribeStreamingService");

exports.startTranscriptionJob = async (req, res) => {
  const { audioUrl } = req.body;

  if (!audioUrl) {
    return res.status(400).json({ error: "Audio URL is required" });
  }

  try {
    console.log("Received audioUrl for transcription:", audioUrl);
    const jobName = await startJob(audioUrl);
    res.json({ transcriptionJobName: jobName });
  } catch (error) {
    console.error("Error starting transcription job:", error.message);
    res.status(500).json({ error: "Failed to start transcription job" });
  }
};

exports.getTranscriptionStatus = async (req, res) => {
  const { jobName } = req.params;

  try {
    const { status, transcriptFileUri } = await getJobStatus(jobName);
    res.json({ status, transcriptFileUri });
  } catch (error) {
    console.error("Error getting transcription job status:", error.message);
    res.status(500).json({ error: "Failed to get transcription job status" });
  }
};

exports.getTranscriptText = async (req, res) => {
  const { jobName } = req.params;

  const bucketName = "persona-pal-audio";
  const key = `${jobName}.json`;

  try {
    const transcriptData = await fetchTranscriptFromS3(bucketName, key);
    const transcribedText = transcriptData.results.transcripts[0].transcript;
    res.json({ transcript: transcribedText });
  } catch (error) {
    console.error("Error fetching transcript:", error.message);
    res.status(500).json({ error: "Failed to fetch transcript" });
  }
};

exports.listFilesInS3 = async (req, res) => {
  try {
    const files = await listFilesInBucket();
    res.json({ files });
  } catch (error) {
    console.error("Error listing files in S3:", error.message);
    res.status(500).json({ error: "Failed to list files in S3" });
  }
};

exports.streamTranscription = async (req, res) => {
  try {
    const transcriptionResult = await transcribeAudioStream(req);
    res.json({ transcription: transcriptionResult });
  } catch (error) {
    console.error("Error streaming transcription:", error.message);
    res.status(500).json({ error: "Failed to stream transcription" });
  }
};

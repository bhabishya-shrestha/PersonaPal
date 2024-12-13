const { startJob, getJobStatus } = require("../services/transcribeService");
const { fetchTranscriptFromS3 } = require("../services/s3Service");

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
    if (status === "COMPLETED") {
      res.json({ status, transcriptFileUri });
    } else {
      res.json({ status });
    }
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

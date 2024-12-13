const { startJob, getJobStatus } = require("../services/transcribeService");
const { fetchTranscriptFromS3 } = require("../services/s3Service");

exports.startTranscriptionJob = async (req, res) => {
  const { audioUrl } = req.body;

  try {
    const jobName = await startJob(audioUrl);
    res.json({ transcriptionJobName: jobName });
  } catch (error) {
    console.error("Error starting transcription job:", error);
    res.status(500).send("Error starting transcription job");
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
    console.error("Error getting transcription job status:", error);
    res.status(500).send("Error getting transcription job status");
  }
};

exports.getTranscriptText = async (req, res) => {
  const { jobName } = req.params;

  // Derive bucketName and key from transcriptFileUri previously obtained or have them standardized
  const bucketName = "persona-pal-audio";
  const key = `${jobName}.json`;

  try {
    const transcriptData = await fetchTranscriptFromS3(bucketName, key);
    const transcribedText = transcriptData.results.transcripts[0].transcript;
    res.json({ transcript: transcribedText });
  } catch (error) {
    console.error("Error fetching transcript:", error);
    res.status(500).send("Error fetching transcript");
  }
};

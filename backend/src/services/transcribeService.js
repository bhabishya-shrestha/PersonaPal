const {
  TranscribeClient,
  StartTranscriptionJobCommand,
  GetTranscriptionJobCommand,
} = require("@aws-sdk/client-transcribe");

const transcribeClient = new TranscribeClient({
  region: process.env.AWS_REGION,
});

exports.startJob = async (audioUrl) => {
  const jobName = `Transcription_${Date.now()}`;
  const params = {
    LanguageCode: "en-US",
    Media: { MediaFileUri: audioUrl },
    TranscriptionJobName: jobName,
    OutputBucketName: "persona-pal-audio",
  };

  try {
    console.log("Starting transcription job with params:", params);
    const command = new StartTranscriptionJobCommand(params);
    const response = await transcribeClient.send(command);
    console.log("AWS Transcribe response:", response);
    return response.TranscriptionJob.TranscriptionJobName;
  } catch (error) {
    console.error("Error starting transcription job:", error);
    throw new Error("Failed to start transcription job");
  }
};

exports.getJobStatus = async (jobName) => {
  const params = { TranscriptionJobName: jobName };
  const command = new GetTranscriptionJobCommand(params);

  try {
    const data = await transcribeClient.send(command);
    const status = data.TranscriptionJob.TranscriptionJobStatus;
    const transcriptFileUri =
      data.TranscriptionJob.Transcript?.TranscriptFileUri;
    return { status, transcriptFileUri };
  } catch (error) {
    console.error("Error getting transcription job status:", error);
    throw new Error("Failed to get transcription job status");
  }
};

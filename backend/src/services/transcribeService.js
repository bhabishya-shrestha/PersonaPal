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

  const command = new StartTranscriptionJobCommand(params);
  const data = await transcribeClient.send(command);
  return data.TranscriptionJob.TranscriptionJobName;
};

exports.getJobStatus = async (jobName) => {
  const params = { TranscriptionJobName: jobName };
  const command = new GetTranscriptionJobCommand(params);
  const data = await transcribeClient.send(command);

  const status = data.TranscriptionJob.TranscriptionJobStatus;
  const transcriptFileUri = data.TranscriptionJob.Transcript?.TranscriptFileUri;
  return { status, transcriptFileUri };
};

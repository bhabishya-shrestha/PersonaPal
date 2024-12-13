const {
  PollyClient,
  SynthesizeSpeechCommand,
} = require("@aws-sdk/client-polly");

const pollyClient = new PollyClient({ region: process.env.AWS_REGION });

exports.synthesizeText = async (text) => {
  const params = {
    Text: text,
    OutputFormat: "mp3",
    VoiceId: "Joanna", // Replace with the desired Polly voice
  };

  const command = new SynthesizeSpeechCommand(params);
  const response = await pollyClient.send(command);

  // Ensure AudioStream is a readable stream
  return response.AudioStream;
};

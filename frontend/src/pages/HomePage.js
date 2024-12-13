import React, { useState } from "react";
import FileUploader from "../components/FileUploader";
import TextToSpeech from "../components/TextToSpeech";
import { startTranscriptionJob } from "../utils/transcriptionService";

function HomePage() {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(""); // URL of the uploaded audio file
  const [transcriptionJobName, setTranscriptionJobName] = useState(""); // Transcription job name
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleTranscribe = async () => {
    console.log("Uploaded Audio URL at Transcribe:", uploadedAudioUrl); // Debug log

    if (!uploadedAudioUrl) {
      alert("Please upload an audio file before starting transcription.");
      return;
    }

    try {
      setIsLoading(true);
      const jobName = await startTranscriptionJob(uploadedAudioUrl); // Call utility function
      setTranscriptionJobName(jobName);
      alert(`Transcription job started: ${jobName}`);
    } catch (error) {
      console.error("Error starting transcription:", error);
      alert("Failed to start transcription job. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to PersonaPal</h1>

      {/* Text-to-Speech Section */}
      <TextToSpeech />

      {/* File Upload Section */}
      <FileUploader setUploadedAudioUrl={setUploadedAudioUrl} />

      {/* Transcription Section */}
      <button onClick={handleTranscribe} disabled={isLoading}>
        {isLoading ? "Processing..." : "Start Transcription"}
      </button>
      {transcriptionJobName && <p>Transcription Job: {transcriptionJobName}</p>}
    </div>
  );
}

export default HomePage;

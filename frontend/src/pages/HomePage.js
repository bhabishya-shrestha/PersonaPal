import React, { useState } from "react";
import FileUploader from "../components/FileUploader";

function HomePage() {
  const [text, setText] = useState("Hello from the AI voice!");
  const [audioUrl, setAudioUrl] = useState(null);
  const [uploadedAudio, setUploadedAudio] = useState(null);

  const handleSpeak = async () => {
    try {
      const response = await fetch("http://localhost:5000/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);

      // Allow user to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = "output.mp3";
      link.click();

      setAudioUrl(url);
    } catch (error) {
      console.error("Error calling /speak:", error);
    }
  };

  const handleTranscribe = async () => {
    if (!uploadedAudio) {
      alert("Please upload an audio file first.");
      return;
    }
    try {
      const response = await fetch("http://localhost:5000/transcribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ audioUrl: uploadedAudio }),
      });
      const data = await response.json();
      console.log("Transcription Job Name:", data.transcriptionJobName);
      alert(`Transcription Job Started: ${data.transcriptionJobName}`);
    } catch (error) {
      console.error("Error calling /transcribe:", error);
      alert("Failed to start transcription job. See console for details.");
    }
  };

  return (
    <div>
      <h1>Welcome to PersonaPal</h1>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows="4"
        cols="50"
      />
      <br />
      <button onClick={handleSpeak}>Generate Voice</button>
      {audioUrl && <audio controls src={audioUrl}></audio>}
      <br />
      <FileUploader setUploadedAudio={setUploadedAudio} />
      <br />
      <button onClick={handleTranscribe}>Start Transcription</button>
    </div>
  );
}

export default HomePage;

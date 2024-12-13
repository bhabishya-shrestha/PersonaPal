import React, { useState, useEffect } from "react";
import FileUploader from "../components/FileUploader";
import TextToSpeech from "../components/TextToSpeech";
import {
  startTranscriptionJob,
  fetchTranscriptionResult,
} from "../utils/transcriptionService";

function HomePage() {
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState(""); // URL of the uploaded audio file
  const [availableFiles, setAvailableFiles] = useState([]); // All files from S3
  const [transcriptionFiles, setTranscriptionFiles] = useState([]); // Only transcription files from S3
  const [selectedFile, setSelectedFile] = useState(""); // Selected audio file for transcription
  const [selectedTranscription, setSelectedTranscription] = useState(""); // Selected transcription file
  const [transcriptionJobName, setTranscriptionJobName] = useState("");
  const [transcriptionText, setTranscriptionText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Fetch files from S3 bucket on load
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch("http://localhost:5000/list-files");
        if (!response.ok) {
          throw new Error("Failed to fetch files from S3.");
        }
        const data = await response.json();
        setAvailableFiles(data.files || []);
        setTranscriptionFiles(
          (data.files || []).filter((file) => file.endsWith(".json"))
        ); // Filter .json files
      } catch (error) {
        console.error("Error fetching files:", error);
        alert("Failed to fetch files. See console for details.");
      }
    };

    fetchFiles();
  }, []);

  const handleTranscribe = async () => {
    const audioUrl = selectedFile || uploadedAudioUrl;

    if (!audioUrl) {
      alert(
        "Please upload or select an audio file before starting transcription."
      );
      return;
    }

    try {
      setIsLoading(true);
      const jobName = await startTranscriptionJob(audioUrl);
      setTranscriptionJobName(jobName);
      alert(`Transcription job started: ${jobName}`);
    } catch (error) {
      console.error("Error starting transcription:", error);
      alert("Failed to start transcription job. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTranscription = async (fileKey) => {
    if (!fileKey) {
      alert("Please select a transcription file first.");
      return;
    }

    try {
      setIsLoading(true);
      const transcript = await fetchTranscriptionResult(fileKey);
      setTranscriptionText(transcript);
    } catch (error) {
      console.error("Error fetching transcription result:", error);
      alert("Failed to fetch transcription result. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="homepage">
      <h1>Welcome to PersonaPal</h1>

      <TextToSpeech />

      {/* File Upload Section */}
      <FileUploader setUploadedAudioUrl={setUploadedAudioUrl} />

      {/* Select File to Transcribe */}
      <div>
        <label>Select a file to transcribe from S3:</label>
        <select
          value={selectedFile}
          onChange={(e) => setSelectedFile(e.target.value)}
        >
          <option value="">-- Select a file --</option>
          {availableFiles
            .filter((file) => !file.endsWith(".json")) // Exclude .json files
            .map((file) => (
              <option
                key={file}
                value={`https://persona-pal-audio.s3.us-east-1.amazonaws.com/${file}`}
              >
                {file}
              </option>
            ))}
        </select>
      </div>

      <button onClick={handleTranscribe} disabled={isLoading}>
        {isLoading ? "Processing..." : "Start Transcription"}
      </button>

      {/* Select Transcription File */}
      <div>
        <label>Select a transcription file to check:</label>
        <select
          value={selectedTranscription}
          onChange={(e) => setSelectedTranscription(e.target.value)}
        >
          <option value="">-- Select a transcription --</option>
          {transcriptionFiles.map((file) => (
            <option
              key={file}
              value={file.replace(".json", "")} // Strip .json for job name
            >
              {file}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={() => handleFetchTranscription(selectedTranscription)}
        disabled={isLoading || !selectedTranscription}
      >
        {isLoading ? "Fetching..." : "Check Transcription"}
      </button>

      {transcriptionText && <p>Transcription Result: {transcriptionText}</p>}
    </div>
  );
}

export default HomePage;

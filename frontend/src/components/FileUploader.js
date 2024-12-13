import React, { useState } from "react";

function FileUploader({ setUploadedAudioUrl }) {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploading(true);
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();
      console.log("Uploaded file URL:", data.fileUrl); // Debug log
      setUploadedAudioUrl(data.fileUrl); // Update state with S3 URL
      alert("File successfully uploaded!");
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Failed to upload file. See console for details.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} disabled={isUploading} />
      {isUploading && <p>Uploading...</p>}
    </div>
  );
}

export default FileUploader;

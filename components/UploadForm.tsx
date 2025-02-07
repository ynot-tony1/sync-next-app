"use client";

import { useState } from "react";

export default function UploadForm() {
  // declaring and initialising state variables for file, status, download url and the download file name
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  // handle file input changes
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // retrieves the first file form the input box from the browser or null is one isnt selected
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    // reseting other state variables
    setStatus("");
    setDownloadUrl("");
    setDownloadFilename("");
  };

  // defines an asynchronous function to handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    // to prevent the default form behavour which is to refresh the page on submission
    event.preventDefault();
    // checks if no file has been selected and updates the status state variable with the status of file selection for the user
    if (!file) {
      setStatus("Please select a file.");
      return;
    }

    try {
      setStatus("Uploading...");
      // creates a new form data object to prepare the file for upload
      const formData = new FormData();
      // appends the selected file to the form data object with the key 'file'
      formData.append("file", file);

      // sends a post request to the backend api endpoint with the form data attached to the body
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/process`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }

      const data = await response.json();

      // if no_audio is within the json response, set its message in the status state variable
      if (data.no_audio) {
        // display the "no audio" message
        setStatus(data.message || "Video has no audio");
        setDownloadUrl("");
        setDownloadFilename("");
      }
      // if already_in_sync is within the json response, display that message
      else if (data.already_in_sync) {
        setStatus(data.message || "Your file was already in sync!");
        setDownloadUrl("");
        setDownloadFilename("");
      }
      else {
        // set the download link and success status
        setDownloadUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`);
        setDownloadFilename(data.filename);
        setStatus("Upload successful!");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus("An error occurred during upload.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="file-input">Choose file</label>
      <input
        id="file-input"
        type="file"
        accept=".avi"
        onChange={handleFileChange}
        style={{ marginLeft: "10px" }}
      />
      <button type="submit" disabled={!file} style={{ marginLeft: "10px" }}>
        Upload
      </button>

      {status && <p>{status}</p>}

      {downloadUrl && (
        <a href={downloadUrl} download={downloadFilename}>
          Download {downloadFilename}
        </a>
      )}
    </form>
  );
}


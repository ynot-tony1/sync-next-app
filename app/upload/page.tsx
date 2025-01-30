"use client";

import { useState } from "react";

export default function UploadPage() {
  // declaring and initialising state variables for file, status, download url and the download file name
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string>("");
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  // defines an asynchronous function to handle the form submission
  const handleSubmit = async (event: React.FormEvent) => {
    // to prevent the default form behavour which is to refresh the page upon submission
    event.preventDefault();
    
    // checks if no file has been selected and updates the status state variable with the status of file selection for the user
    if (!file) {
      setStatus("Please select a file.");
      return;
    }
    // creates a new form data object to prepare the file for upload
    const formData = new FormData();
    // appends the selected file to the form data object with the key 'file'
    formData.append("file", file);
    try {
      // updates the status state variable to inform the user that the upload is in progress
      setStatus("Uploading...");
      
      // sends a POST request to the backend api endpoint with the form data attached to the body
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/process`,
        {
          method: "POST",
          body: formData,
        }
      );
      
      // checks if the response status is not in the range 200-299 ie ok
      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }
      // parses the json response from the apis response
      const data = await response.json();
      // constructs the download URL using the backend URL and the URL returned from the api
      setDownloadUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`);
      // sets the download filename using the filename returned from the api
      setDownloadFilename(data.filename);
      setStatus("Upload successful!");
    } catch (error) {
      console.error("Upload error:", error);
      // updates the status to let the usr know that an error occurred during the upload
      setStatus("An error occurred during upload.");
    }
  };

  // defines a function to handle changes in the browsers file input field
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // retrieves the first selected file or sets it to null if no file is selected
    const selectedFile = event.target.files?.[0] || null;

    // updates the file state variable with the selected file
    setFile(selectedFile);
    // resets the 'status' state to an empty string to clear any previous messages
    setStatus("");
    // resets the download url state to clear any previous urls
    setDownloadUrl("");
    // resets the download filename state to clear any previous filenames
    setDownloadFilename("");
  };

  // returns the jsx to render the upload form and status messages
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload a .AVI File</h1>
      
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-input">Choose file</label>
        
        <input type="file" accept=".avi" onChange={handleFileChange} />
        
        <button type="submit" disabled={!file} style={{ marginLeft: "10px" }}>
          Upload
        </button>
      </form>
      
      {status && <p>{status}</p>}
      
      {downloadUrl && (
        <a href={downloadUrl} download={downloadFilename}>
          Download {downloadFilename}
        </a>
      )}
    </div>
  );
}

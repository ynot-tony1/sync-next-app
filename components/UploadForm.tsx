/**
 * UploadForm Component
 *
 * This component renders a form for uploading a file. When a user chooses a file for upload
 * and submits the form, the file is sent to the backend API endpoint for processing.
 *
 * It uses state variables to manage:
 * - The selected file.
 * - Status messages that tell the user about the upload process.
 * - The download URL and filename for the processed file.
 *
 * handleFileChange retrieves the file from the browser and resets any previous status or download information.
 * handleSubmit prevents the default form behavior, validates the file selection, and then uploads the file.
 * Based on the APIs response, it either displays an error message or sets the download link for the user.
 *
 * Rendered on the client side, hence 'use client'.
 * Returns a JSX element.
 */
"use client";

import { useState } from "react";

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  /**
   * Handles changes to the file input.
   *
   * Retrieves the file from the input, and updates the state. 
   * If no file is selected it returns null and resets the state variables.
   *
   * @param event - The change event from the file input.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setDownloadUrl("");
    setDownloadFilename("");
  };

  /**
   * Handles form submission for file upload.
   *
   * Prevents the default form behavior, validates that a file has been selected and if so,
   * sends a POST request with the file to the backend API.
   * Based on the data from the response, it updates the status message and if successful, sets the download URL and filename.
   *
   * @param event - The form submission event.
   */
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/process`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload file.");
      }
      const data = await response.json();

      if (data.no_audio) {
        setDownloadUrl("");
        setDownloadFilename("");
      } else if (data.no_video) {
        setDownloadUrl("");
        setDownloadFilename("");
      } else if (data.no_fps) {
        setDownloadUrl("");
        setDownloadFilename("");
      } else if (data.already_in_sync) {
        setDownloadUrl("");
        setDownloadFilename("");
      } else {
        setDownloadUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`);
        setDownloadFilename(data.filename);
      }
    } catch (error) {
      console.error("Upload error:", error);
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
        style={{ marginLeft: 10 }}
      />
      <button type="submit" disabled={!file} style={{ marginLeft: 10 }}>
        Upload
      </button>
      {downloadUrl && (
        <a href={downloadUrl} download={downloadFilename}>
          Download {downloadFilename}
        </a>
      )}
    </form>
  );
}

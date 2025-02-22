"use client";

import React, { useState } from "react";

/**
 * A React functional component that renders a file upload form.
 *
 * @remarks
 * This component enables users to select a file and upload it to a backend API endpoint for processing.
 * Upon form submission, the selected file is sent to the server.
 * Based on the server response, the component either resets the download state or updates it with a valid download URL and filename.
 * The component manages state for the selected file, download URL, and download filename.
 *
 * @returns The rendered UploadForm component.
 */
const UploadForm: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  /**
   * Handles changes in the file input.
   *
   * @remarks
   * This function retrieves the selected file from the event and updates the state accordingly.
   * It also resets any previously stored download URL and filename.
   *
   * @param event The file input change event.
   */
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
    setDownloadUrl("");
    setDownloadFilename("");
  };

  /**
   * Handles the file upload form submission.
   *
   * @remarks
   * This function prevents the default form submission behavior, validates the file selection,
   * and sends the file to the backend API for processing.
   * Depending on the response, it updates the state with either an error or the download URL and filename.
   *
   * @param event The form submission event.
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
};

export default UploadForm;

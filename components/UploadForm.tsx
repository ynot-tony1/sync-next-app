"use client";

import React, { useState, useEffect } from "react";

/**
 * A functional component that renders an upload form with two distinct phases.
 *
 * @remarks
 * This component manages a two-phase process for file uploading:
 * - **Initial Phase:** Displays a visible label (acting as a button) that triggers the file selection dialog
 *   (using the HTML `label` element associated with a hidden file input) along with an "Upload" button.
 * - **Detailed Phase:** Once a file is selected and the "Upload" button is clicked, the component switches
 *   to the detailed phase, automatically uploads the file, and displays a download link (if the upload succeeds).
 *
 * The upload is performed by sending the file to a backend API endpoint using the Fetch API. The component
 * also manages UI state to indicate whether the file is currently being uploaded.
 *
 * @returns {JSX.Element} The rendered upload form component.
 */
const UploadForm: React.FC = () => {
  /**
   * Represents the current phase of the upload process.
   * - "initial": The file selection and upload initiation phase.
   * - "detailed": The phase where the file is being uploaded and the download link is displayed.
   */
  const [phase, setPhase] = useState<"initial" | "detailed">("initial");
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  /**
   * Handles the file selection event from the file input element.
   *
   * @param e - The change event triggered by the file input.
   * @returns {void}
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  /**
   * Handles the click event of the initial upload button.
   *
   * @remarks
   * If no file has been selected, the user is alerted with a message.
   * If a file is present, the component's phase is switched from "initial" to "detailed",
   * which in turn triggers the file upload process via a side-effect.
   *
   * @returns {void} 
   */
  const handleInitialUploadClick = (): void => {
    if (!file) {
      alert("Please select a file first by clicking 'Browse'.");
      return;
    }
    setPhase("detailed");
  };

  /**
   * An effect hook that triggers the file upload when the phase changes to "detailed" and a file is selected.
   *
   * @remarks
   * When the `phase` state is set to "detailed" and a file is available, this effect sends the file to
   * the backend API endpoint (determined by the environment variable `NEXT_PUBLIC_BACKEND_URL`). The file
   * is packaged into a FormData object and sent via a POST request. Based on the response from the backend,
   * the download URL and filename are updated in the state.
   *
   * If the backend indicates issues such as "no_audio", "no_video", "no_fps", or "already_in_sync",
   * the download URL and filename remain empty.
   *
   * @returns {Promise<void>} A promise that resolves when the upload is completed.
   */
  useEffect(() => {
    const uploadFile = async (): Promise<void> => {
      if (phase === "detailed" && file) {
        try {
          const formData = new FormData();
          formData.append("file", file);
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
          if (
            data.no_audio ||
            data.no_video ||
            data.no_fps ||
            data.already_in_sync
          ) {
            setDownloadUrl("");
            setDownloadFilename("");
          } else {
            setDownloadUrl(`${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`);
            setDownloadFilename(data.filename);
          }
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
    };

    uploadFile();
  }, [phase, file]);

  if (phase === "initial") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-blue-500">
        <label
          htmlFor="file-input"
          className="px-8 py-4 bg-blue-500 text-white text-xl rounded cursor-pointer"
        >
          Browse
        </label>
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
        />
        <button
          onClick={handleInitialUploadClick}
          className="px-8 py-4 bg-green-500 text-white text-xl rounded"
        >
          Upload
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 bg-blue-500">
      <div className="text-center">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download
            className="px-4 py-2 text-white text-xl rounded hover:opacity-90"
            style={{ backgroundColor: "#ba4a00" }}
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
  
};

export default UploadForm;

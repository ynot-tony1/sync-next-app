"use client";
import React, { useState, useEffect } from "react";

/**
 * A React functional component that handles file uploads.
 * 
 * This component renders two distinct phases:
 * - "initial": displays a Browse button and an Upload button.
 * - "detailed": after the upload begins, displays the download link.
 *
 * It manages file selection, submission, and response handling to update
 * download information based on the response from the backend.
 *
 * @component
 * @returns {JSX.Element} The rendered UploadForm component.
 */

const UploadForm: React.FC = () => {
  const [phase, setPhase] = useState<"initial" | "detailed">("initial");
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");

  /**
   * Handles the file input change event.
   * 
   * @param {React.ChangeEvent<HTMLInputElement>} e - The file input change event.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  /**
   * Handles the initial upload button click event.
   * Validates if a file has been selected and then sets the phase to "detailed".
   */
  const handleInitialUploadClick = () => {
    if (!file) {
      alert("Please select a file first by clicking 'Browse'.");
      return;
    }
    setPhase("detailed");
  };

  /**
   * Side effect to upload the file when the phase is "detailed".
   * 
   * This effect runs when either the phase or the selected file changes.
   * It constructs a FormData object, sends a POST request to the backend,
   * and then handles the response to update download URL and filename.
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
            setDownloadUrl(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`
            );
            setDownloadFilename(data.filename);
          }
        } catch (error) {
          console.error("Upload error:", error);
        } finally {
        }
      }
    };
    uploadFile();
  }, [phase, file]);

  if (phase === "initial") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-darkblue">
        <label
          htmlFor="file-input"
          className="px-8 py-4 bg-darkblue text-white text-xl rounded cursor-pointer"
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
          className="px-8 py-4 bg-darkblue text-white text-xl rounded"
        >
          Upload
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 bg-darkblue">
      <div className="w-full max-w-md mx-auto text-center">
        {downloadUrl && (
          <a
            href={downloadUrl}
            download={downloadFilename}
            className="block bg-burntorange text-white text-xl font-bold py-3 rounded shadow hover:opacity-90"
          >
            Download
          </a>
        )}
      </div>
    </div>
  );
};

export default UploadForm;

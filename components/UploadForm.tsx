"use client";

import React, { useState, useRef, useEffect } from "react";
import ProcessVideoWebSocket from "@/components/ProcessVideoWebSocket";

const UploadForm: React.FC = () => {
  // "initial" shows the two buttons; "detailed" shows the upload result and progress bar.
  const [phase, setPhase] = useState<"initial" | "detailed">("initial");
  const [file, setFile] = useState<File | null>(null);
  const [downloadUrl, setDownloadUrl] = useState<string>("");
  const [downloadFilename, setDownloadFilename] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);

  // Reference to the hidden file input.
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Trigger the file dialog.
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  // Save the selected file.
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
  };

  // When "Upload" is clicked in the initial view, if a file is selected, switch phase.
  const handleInitialUploadClick = () => {
    if (!file) {
      alert("Please select a file first by clicking 'Browse'.");
      return;
    }
    setPhase("detailed");
  };

  // Automatically submit the file when in the detailed phase.
  useEffect(() => {
    const uploadFile = async (): Promise<void> => {
      if (phase === "detailed" && file) {
        setIsUploading(true);
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
          setIsUploading(false);
        }
      }
    };
    uploadFile();
  }, [phase, file]);

  // Initial view: Only the Browse and Upload buttons.
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

  // Detailed view: Render only the upload result (download link) and progress bar.
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

"use client";
import React, { useState, useEffect } from "react";
import { useUploadFile } from "./UploadFileContext";

/**
 * UploadForm Component.
 *
 * @remarks
 * This component renders a file upload form that allows users to select a file (via a "Browse" box)
 * and initiate an upload (via an "Upload" box). The component maintains two phases:
 * - "initial": Renders the file input and upload button.
 * - "detailed": Initiates the file upload process.
 *
 * In the "detailed" phase, the file is sent to a backend endpoint using a POST request.
 * The component uses the UploadFileContext to update the download link once the upload is complete.
 *
 * Tailwind classes are applied to ensure that the entire boxes (for both "Browse" and "Upload") are clickable.
 *
 * @returns {JSX.Element | null} The rendered upload form during the "initial" phase, or null otherwise.
 */
const UploadForm: React.FC = () => {
  // Component state management
  const [phase, setPhase] = useState<"initial" | "detailed">("initial");
  const [file, setFile] = useState<File | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const { setDownloadLink } = useUploadFile();

  /**
   * Handles changes to the file input.
   *
   * @remarks
   * When a user selects a file, this handler updates the state with the selected file and resets the upload flag.
   *
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event triggered by the file input.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setHasUploaded(false);
  };

  /**
   * Handles the click event on the upload box.
   *
   * @remarks
   * Verifies that a file has been selected. If not, it alerts the user.
   * If a file is selected, the component phase is changed to "detailed" to trigger the file upload process.
   */
  const handleInitialUploadClick = () => {
    if (!file) {
      alert("Please select a file first by clicking 'Browse'.");
      return;
    }
    setPhase("detailed");
  };

  /**
   * Effect hook that initiates the file upload process when the component phase changes to "detailed".
   *
   * @remarks
   * The effect defines an asynchronous function that:
   * - Constructs a FormData object with the selected file.
   * - Sends the file to the backend using a POST request.
   * - Parses the response and updates the download link via the UploadFileContext.
   * - Handles error scenarios by logging to the console.
   *
   * The effect is re-triggered whenever the phase, file, hasUploaded flag, or setDownloadLink function changes.
   */
  useEffect(() => {
    const uploadFile = async (): Promise<void> => {
      if (phase === "detailed" && file && !hasUploaded) {
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
            setDownloadLink("", "");
          } else {
            setDownloadLink(
              `${process.env.NEXT_PUBLIC_BACKEND_URL}${data.url}`,
              data.filename
            );
          }
          setHasUploaded(true);
        } catch (error) {
          console.error("Upload error:", error);
        }
      }
    };

    uploadFile();
  }, [phase, file, hasUploaded, setDownloadLink]);

  if (phase === "initial") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-darkblue">
        <div className="flex flex-col space-y-4 w-full max-w-md">
          <label
            htmlFor="file-input"
            className="cursor-pointer p-8 bg-burntorange rounded shadow"
          >
            <span className="block text-white text-xl text-center">
              Browse
            </span>
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <div
            role="button"
            onClick={handleInitialUploadClick}
            className="cursor-pointer p-8 bg-burntorange rounded shadow"
          >
            <span className="block text-white text-xl text-center">
              Upload
            </span>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UploadForm;

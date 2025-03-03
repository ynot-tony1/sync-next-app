/**
 * UploadForm Component.
 *
 * @remarks
 * Renders a file upload form that allows users to browse for a file and initiate an upload.
 * Upon initiating the upload, the component sends the file to the backend and updates the
 * download link state via the UploadFileContext.
 *
 * This component manages two phases: the "initial" phase displays the file input and upload button,
 * while the "detailed" phase triggers the file upload.
 *
 * @returns {JSX.Element | null} The rendered upload form when in the initial phase; otherwise, null.
 */
"use client";
import React, { useState, useEffect } from "react";
import { useUploadFile } from "./UploadFileContext";

const UploadForm: React.FC = () => {
  const [phase, setPhase] = useState<"initial" | "detailed">("initial");
  const [file, setFile] = useState<File | null>(null);
  const [hasUploaded, setHasUploaded] = useState(false);
  const { setDownloadLink } = useUploadFile();

  /**
   * Handles the change event on the file input element.
   *
   * @remarks
   * Retrieves the selected file from the event and updates the component state. Also resets the upload flag.
   *
   * @param e - The change event from the file input.
   * @returns {void}
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    setFile(selectedFile);
    setHasUploaded(false);
  };

  /**
   * Handles the click event on the upload button.
   *
   * @remarks
   * Verifies that a file has been selected. If no file is selected, alerts the user.
   * Otherwise, transitions the component to the "detailed" phase to trigger the upload process.
   *
   * @returns {void}
   */
  const handleInitialUploadClick = () => {
    if (!file) {
      alert("Please select a file first by clicking 'Browse'.");
      return;
    }
    setPhase("detailed");
  };

  /**
   * Effect hook to handle file upload when the component phase changes to "detailed".
   *
   * @remarks
   * This effect defines an asynchronous function that constructs a FormData object with the selected file,
   * sends it to the backend using a POST request, and processes the response. Depending on the response,
   * it updates the download link state via the setDownloadLink function from the UploadFileContext.
   * The effect ensures that the upload only occurs once per file selection by checking the hasUploaded flag.
   *
   * @returns {void} A cleanup function is not required in this effect.
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
          <div className="p-8 bg-burntorange rounded shadow">
            <label
              htmlFor="file-input"
              className="block text-white text-xl cursor-pointer text-center"
            >
              Browse
            </label>
            <input
              type="file"
              id="file-input"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>
          <div className="p-8 bg-burntorange rounded shadow">
            <button
              onClick={handleInitialUploadClick}
              className="w-full text-white text-xl"
            >
              Upload
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default UploadForm;

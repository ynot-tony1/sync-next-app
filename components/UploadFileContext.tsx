/**
 * UploadFileContext Module.
 *
 * @remarks
 * Provides a React context for managing file upload state including the download URL and filename.
 * The module exports a provider component and a custom hook for consuming the context in child components.
 */

"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { UploadFileContextType } from "types/upload-file";

/**
 * A React context that holds the state for file uploads.
 *
 * @remarks
 * Contains the download URL, the download filename, and a function to update these values.
 */
export const UploadFileContext = createContext<UploadFileContextType | null>(null);

/**
 * UploadFileProvider Component.
 *
 * @remarks
 * Wraps child components and provides them with access to the upload file state.
 *
 * @param {ReactNode} children - The child components that require access to the upload file state.
 * @returns {JSX.Element} The provider component.
 */
export const UploadFileProvider = ({ children }: { children: ReactNode }) => {
  const [downloadUrl, setDownloadUrl] = useState("");
  const [downloadFilename, setDownloadFilename] = useState("");

  const setDownloadLink = (url: string, filename: string) => {
    setDownloadUrl(url);
    setDownloadFilename(filename);
  };

  return (
    <UploadFileContext.Provider value={{ downloadUrl, downloadFilename, setDownloadLink }}>
      {children}
    </UploadFileContext.Provider>
  );
};

/**
 * useUploadFile Hook.
 *
 * @remarks
 * Provides a convenient way to access the upload file state from the UploadFileContext.
 *
 * @throws Will throw an error if the hook is used outside of an UploadFileProvider.
 * @returns {UploadFileContextType} The current upload file context value.
 */
export const useUploadFile = () => {
  const context = useContext(UploadFileContext);
  if (!context) {
    throw new Error("useUploadFile must be used within a UploadFileProvider");
  }
  return context;
};

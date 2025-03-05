/**
 * UploadPage Component.
 *
 * @remarks
 * This component serves as the main upload page for the application. It renders both the file upload form
 * and the video processing progress display. The page is wrapped by two context providers:
 *
 * - WebSocketProvider: Supplies real-time updates from the backend via a WebSocket connection, including processing
 *   messages, milestones, and progress data.
 *
 * - UploadFileProvider: Manages and shares the download state (download URL and filename) across the application.
 *
 * The wrapping ensures that both the UploadForm and ProcessVideoWebSocket components have access to the shared
 * download link state. The UploadForm handles file selection and triggers the upload process, while the
 * ProcessVideoWebSocket component displays processing status and, upon a successful upload, renders a clickable
 * download link based on the shared state.
 *
 * @returns {JSX.Element} The rendered UploadPage component.
 *
 * @example
 * <UploadPage />
 */
"use client";
import React from "react";
import UploadForm from "@/components/UploadForm";
import ProcessVideoWebSocket from "@/components/ProcessVideoWebSocket";
import { WebSocketProvider } from "@/components/WebSocketContext";
import { UploadFileProvider } from "@/components/UploadFileContext";

export default function UploadPage() {
  return (
    <WebSocketProvider>
      <UploadFileProvider>
        <div className="text-center p-4">
          <UploadForm />
          <ProcessVideoWebSocket />
        </div>
      </UploadFileProvider>
    </WebSocketProvider>
  );
}

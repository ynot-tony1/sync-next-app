/**
 * ProcessVideoWebSocket Component.
 *
 * @remarks
 * Renders a progress display for video processing that includes a progress bar and a sync indicator.
 * The component uses the WebSocket context to retrieve processing messages and milestones, and the
 * UploadFile context to obtain the download link when processing is successful.
 *
 * @param {Object} props - The component properties.
 * @param {boolean} props.visible - A flag indicating whether the component should be rendered.
 * @returns {JSX.Element | null} The rendered component if visible; otherwise, null.
 */
"use client";
import React from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { useWebSocket } from "@/components/WebSocketContext";
import { useUploadFile } from "@/components/UploadFileContext"; 


/**
 * Functional component that displays the video processing status.
 *
 * @remarks
 * The component retrieves the current message, processing milestones, indicator state, and progress percentage from the WebSocket context.
 * It also retrieves the download URL and filename from the UploadFile context. Depending on the current indicator state, the component renders
 * a synchronization icon that may be wrapped in an anchor tag if a download link is available.
 */
const ProcessVideoWebSocket: React.FC<{ visible: boolean }> = ({ visible }) => {
  const { message, progressSteps, indicatorState, progressPercent } = useWebSocket();
  const { downloadUrl, downloadFilename } = useUploadFile(); 

  if (!visible) return null;

  return (
    <div className="flex flex-col items-center justify-start p-5 bg-darkblue text-creme font-sans">
      <div
        data-testid="message-container"
        className="text-2xl my-5 min-h-[3rem] font-bold text-center"
      >
        {message}
      </div>
      
      <ProgressBar
        progressPercent={progressSteps.length === 9 ? 100 : progressPercent}
        steps={progressSteps.map((step, index) => ({ id: (index + 1).toString(), label: step }))}
        progressSteps={progressSteps}
      />

      <div className="mt-12">
        {indicatorState === "error" && (
          <SyncIcon indicatorState="error" data-testid="sync-icon-error" />
        )}
        {indicatorState === "success" && downloadUrl ? (
          <a href={downloadUrl} download={downloadFilename}>
            <SyncIcon indicatorState="success" data-testid="sync-icon-success" />
          </a>
        ) : (
          indicatorState === "success" && (
            <SyncIcon indicatorState="success" data-testid="sync-icon-success" />
          )
        )}
        {indicatorState === "syncing" && (
          <SyncIcon indicatorState="syncing" data-testid="sync-icon-syncing" />
        )}
      </div>
    </div>
  );
};

export default ProcessVideoWebSocket;

/**
 * WebSocket Component.
 *
 * @remarks
 * Renders a progress display for video processing that includes a progress bar and a sync indicator.
 * The component uses the WebSocket context to retrieve processing messages and milestones, and the
 * UploadFile context to obtain the download link when processing is successful.
 *
 * @param {Object} props - The component properties.
 * @returns {JSX.Element | null} The rendered component if visible; otherwise, null.
 */
"use client";
import React from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { useWebSocket } from "@/components/WebSocketContext";
import { useUploadFile } from "@/components/UploadFileContext";
import { IndicatorState } from "@/types/web-socket-props";


/**
 * Functional component that displays the video processing status.
 *
 * @remarks
 * The component retrieves the current message, processing milestones, indicator state, and progress percentage from the WebSocket context.
 * It also retrieves the download URL and filename from the UploadFile context. Depending on the current indicator state, the component renders
 * a synchronization icon that may be wrapped in an anchor tag if a download link is available.
 */
const WebSocket: React.FC = () => {
  const { message, progressSteps, indicatorState, progressPercent } = useWebSocket();
  const { downloadUrl, downloadFilename } = useUploadFile();


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
        steps={progressSteps.map((step: string, index: number) => ({ id: (index + 1).toString(), label: step }))}
        progressSteps={progressSteps}
      />

      <div className="mt-12">
        <IndicatorIcon indicatorState={indicatorState} downloadUrl={downloadUrl} downloadFilename={downloadFilename} />
      </div>
    </div>
  );
};

const IndicatorIcon: React.FC<{ indicatorState: IndicatorState, downloadUrl: string, downloadFilename: string }> = ({ indicatorState, downloadUrl, downloadFilename }) => {

  if (indicatorState === null) {
    return <></>
  }

  if (indicatorState === "error") {
    return <SyncIcon indicatorState="error" data-testid="sync-icon-error" />
  }

  if (indicatorState === "success") {

    if (downloadUrl) {
      return (
      <a href={downloadUrl} download={downloadFilename}>
        <SyncIcon indicatorState="success" data-testid="sync-icon-success" />
      </a>
      )
    }

    return <SyncIcon indicatorState="success" data-testid="sync-icon-success" />

  }

  if (indicatorState === "syncing") {
    return <SyncIcon indicatorState="syncing" data-testid="sync-icon-syncing" />
  }


};



export default WebSocket;

"use client";

import React from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { useWebSocket } from "@/components/WebSocketContext"; // adjust the path as needed

const ProcessVideoWebSocket: React.FC<{ visible: boolean }> = ({ visible }) => {
  if (!visible) return null;

  const { message, progressSteps, indicatorState, progressPercent } = useWebSocket();

  return (
    <div className="flex flex-col items-center justify-start p-5 bg-darkblue text-black">
      <div data-testid="message-container" className="text-2xl my-5 min-h-[3rem]">
        {message}
      </div>
      <ProgressBar
        progressPercent={progressPercent}
        steps={progressSteps.map((step, index) => ({ id: (index + 1).toString(), label: step }))}
        progressSteps={progressSteps}
      />
      <div className="mt-12">
        {indicatorState !== "syncing" && indicatorState === "error" && (
          <SyncIcon indicatorState="error" data-testid="sync-icon-error" />
        )}
        {indicatorState !== "syncing" && indicatorState === "success" && (
          <SyncIcon indicatorState="success" data-testid="sync-icon-success" />
        )}
        {indicatorState === "syncing" && (
          <SyncIcon indicatorState="syncing" data-testid="sync-icon-syncing" />
        )}
      </div>
    </div>
  );
};

export default ProcessVideoWebSocket;

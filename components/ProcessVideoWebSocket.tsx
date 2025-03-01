"use client";
import React from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { useWebSocket } from "@/components/WebSocketContext"; // adjust the path as needed

/**
 * A React functional component that renders a WebSocket-driven progress view.
 *
 * This component uses a WebSocket context to receive real-time messages,
 * progress steps, and indicator states, and then renders a progress bar along
 * with a corresponding sync icon based on the current state. The component is
 * conditionally rendered based on the `visible` prop.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.visible - Determines if the component should be rendered.
 * @returns {JSX.Element | null} The rendered component or null if not visible.
 */
const ProcessVideoWebSocket: React.FC<{ visible: boolean }> = ({ visible }) => {
  /**
   * Retrieves WebSocket-related state from the context.
   * - message: The latest message from the WebSocket.
   * - progressSteps: An array of progress step labels.
   * - indicatorState: The current state indicator ("error", "syncing", "success").
   * - progressPercent: The computed progress percentage.
   */
  const { message, progressSteps, indicatorState, progressPercent } = useWebSocket();

  if (!visible) return null;

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

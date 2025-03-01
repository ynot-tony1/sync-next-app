"use client";

import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { Step, IndicatorState } from "@/types/web-socket-props";

/**
 * An array of key milestones in the video processing workflow.
 -* @remarks
 * Each milestone is represented by a {@link Step} object with the following properties:
 * - **id**: A unique identifier.
 * - **matchText**: A text fragment that, when present in an incoming message, indicates that the milestone has been reached.
 * - **label**: A descriptive label used for display.
 */
const IMPORTANT_STEPS: Step[] = [
  { id: "1", matchText: "Here we go", label: "Initiate" },
  { id: "2", matchText: "Setting up our filing system", label: "File Setup" },
  { id: "3", matchText: "Copying your file to work on", label: "Copy" },
  { id: "4", matchText: "Finding out about your file", label: "Inspect" },
  { id: "5", matchText: "Ok, had a look", label: "Analyze" },
  { id: "6", matchText: "Pass number", label: "Sync Passses" },
  { id: "7", matchText: "Adjusting the streams in your file", label: "Adjust" },
  { id: "8", matchText: "Making the final shift", label: "Final Shift" },
  { id: "9", matchText: "download your file", label: "Complete" },
];

/**
 * A React functional component that establishes a WebSocket connection to monitor video processing status.
 *
 * This component:
 * - Opens a WebSocket connection to `ws://localhost:8000/ws` and sets up event handlers.
 * - Stores incoming messages in a message queue and processes them at regular intervals.
 * - Updates state variables:
 *   - **message**: The current status message.
 *   - **progressSteps**: An array of labels for the milestones reached.
 *   - **indicatorState**: The current synchronization state (syncing, error, or success).
 * - Renders the current message, a progress bar, a spinner (SyncIcon), and a color chart below the spinner.
 *
 * @returns The rendered ProcessVideoWebSocket component.
 */
const ProcessVideoWebSocket: React.FC = () => {
  const [message, setMessage] = useState("");
  const [progressSteps, setProgressSteps] = useState<string[]>([]);
  const [indicatorState, setIndicatorState] = useState<IndicatorState>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);

  useEffect(() => {
    /**
     * Establishes the WebSocket connection and sets up event handlers.
     */
    const connectWS = (): void => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.onopen = (): void => {
        setWsConnected(true);
      };

      ws.onmessage = (e: MessageEvent<string>): void => {
        messageQueue.current.push(e.data);
      };

      ws.onclose = (): void => {
        setWsConnected(false);
        setTimeout(connectWS, 5000);
      };

      ws.onerror = (e: Event): void => {
        console.error("WS error:", e);
        ws.close();
      };

      wsRef.current = ws;
    };

    const connectTimeout = setTimeout(connectWS, 1000);
    return () => {
      clearTimeout(connectTimeout);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
    /**
     * Processes messages from the WebSocket connection at regular intervals.
     * - Updates the current message.
     * - Sets the indicator state based on message content.
     * - Records milestones reached.
     */
    if (!wsConnected) return;
  
    const intervalId = window.setInterval(() => {
      if (messageQueue.current.length) {
        const nextMsg = messageQueue.current.shift() || "";
        setMessage(nextMsg);
  
        if (/(no video|couldn'?t find any video stream|no audio|error|aborting process)/i.test(nextMsg)) {
          setIndicatorState("error");
          messageQueue.current = [];
        } else if (/(already\s+in\s+sync|already\s+synchronized|get your file|our clip is already in sync)/i.test(nextMsg)) {
          setIndicatorState("success");
        } else {
          setIndicatorState("syncing");
        }
  
        const matchedStep = IMPORTANT_STEPS.find((step) =>
          nextMsg.toLowerCase().includes(step.matchText.toLowerCase())
        );
        if (matchedStep) {
          setProgressSteps(prev => {
            if (!prev.includes(matchedStep.label)) {
              return [...prev, matchedStep.label];
            }
            return prev;
          });
        }
      }
    }, 500);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [wsConnected]);
  
  const totalSteps = IMPORTANT_STEPS.length;
  const progressPercent = Math.min(100, Math.round((progressSteps.length / totalSteps) * 100));

  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "flex-start",
        minHeight: "100vh",
        background: "#f4f4f4",
        color: "black",
        padding: "20px",
      }}
    >
      <div data-testid="message-container" style={{ fontSize: "1.6rem", margin: "20px 0", minHeight: "3rem" }}>
        {message}
      </div>
      <ProgressBar
        progressPercent={progressPercent}
        steps={IMPORTANT_STEPS.map(step => ({ id: step.id.toString(), label: step.label }))}
        progressSteps={progressSteps}
      />
      <div style={{ marginTop: "50px" }}>
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

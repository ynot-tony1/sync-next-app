"use client";

import React, { useEffect, useState, useRef } from "react";
import ProgressBar from "./ProgressBar";
import SyncIcon from "./SyncIcon";
import { Step, IndicatorState } from "@/types/web-socket-props";

/**
 * An array of key milestones in the video processing workflow.
 *
 * @remarks
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
 * @remarks
 * This component is designed to track the progress of video processing by:
 * - Opening a WebSocket connection to `ws://localhost:8000/ws` and configuring event handlers.
 * - Managing incoming messages with a message queue (stored in `messageQueue`) and updating state variables such as
 *   `wsConnected`, `message`, `indicatorState`, and `progressSteps`.
 * - Processing messages every 500ms to detect errors, success conditions, and milestones defined in {@link IMPORTANT_STEPS}.
 * - Rendering the current message along with a progress bar (via {@link ProgressBar}) and a sync icon (via {@link SyncIcon}).
 *
 * @returns The rendered ProcessVideoWebSocket component, including the SyncIcon and ProgressBar.
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
     * Initializes the WebSocket connection and sets up its event handlers.
     *
     * @remarks
     * The function `connectWS` creates a new WebSocket instance connecting to `ws://localhost:8000/ws`
     * and assigns several callbacks:
     *
     * - **onopen**: When the connection is established, it updates the state variable `wsConnected` to `true`,
     *   indicating that the WebSocket is ready to receive messages.
     *
     * - **onmessage**: Each time a message is received, the callback captures the event parameter `e` (of type
     *   `MessageEvent<string>`) and pushes the message data (`e.data`) onto the `messageQueue` ref, which is later
     *   used for processing.
     *
     * - **onclose**: If the connection is closed, the state `wsConnected` is set to `false` and a reconnection is
     *   scheduled by calling `connectWS` again after 5 seconds.
     *
     * - **onerror**: Any error event (`e: Event`) encountered during communication is logged to the console, and the
     *   WebSocket is closed to prevent further issues.
     *
     * The created WebSocket instance is stored in `wsRef` for later access and cleanup.
     */
    const connectWS = (): void => {
      const ws = new WebSocket("ws://localhost:8000/ws");

      ws.onopen = (): void => {
        setWsConnected(true);
      };

      /**
       * Called when a message is received from the WebSocket.
       *
       * @param e - The message event containing the received data.
       */
      ws.onmessage = (e: MessageEvent<string>): void => {
        messageQueue.current.push(e.data);
      };

      ws.onclose = (): void => {
        setWsConnected(false);
        setTimeout(connectWS, 5000);
      };

      /**
       * Called when an error occurs on the WebSocket.
       *
       * @param e - The error event.
       */
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
    if (!wsConnected) return;

    /**
     * Processes messages from the queue at fixed intervals of 500ms.
     *
     * @remarks
     * The interval function performs the following steps for each message in the `messageQueue`:
     * - Gets the next message (stored in the variable `nextMsg`) from the queue.
     * - Updates the state variable `message` to display the latest received message.
     * - If this is the first message (i.e. `indicatorState` is `null`), it sets `indicatorState` to `"syncing"`.
     * - Inspects the content of `nextMsg` for error-related phrases (using a regular expression). If an error is detected,
     *   it sets `indicatorState` to `"error"` and clears the `messageQueue`.
     * - Alternatively, if success-related phrases are detected, it sets `indicatorState` to `"success"`.
     * - It also compares `nextMsg` against each milestone in {@link IMPORTANT_STEPS}. If a milestone is matched and
     *   its label is not already present in the `progressSteps` array, the label is added to `progressSteps` using the
     *   updater function.
     *
     * This mechanism ensures that the UI remains updated with the latest processing state and that progress milestones
     * are accurately recorded.
     */
    const intervalId = window.setInterval(() => {
      if (messageQueue.current.length) {
        const nextMsg = messageQueue.current.shift() || "";
        setMessage(nextMsg);

        if (indicatorState === null) {
          setIndicatorState("syncing");
        }

        if (indicatorState !== "success" && indicatorState !== "error") {
          if (/(no video|couldn'?t find any video stream|no audio|error|aborting process)/i.test(nextMsg)) {
            setIndicatorState("error");
            messageQueue.current = [];
            return;
          } else if (/(already\s+in\s+sync|already\s+synchronized|download your file|our clip is already in sync)/i.test(nextMsg)) {
            setIndicatorState("success");
          } else {
            setIndicatorState("syncing");
          }
        }

        const matchedStep = IMPORTANT_STEPS.find((step) =>
          nextMsg.toLowerCase().includes(step.matchText.toLowerCase())
        );
        if (matchedStep && progressSteps.indexOf(matchedStep.label) === -1) {
          setProgressSteps(function (prevSteps: string[]): string[] {
            return prevSteps.concat(matchedStep.label);
          });
        }
      }
    }, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, [wsConnected, indicatorState, progressSteps]);

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
      <div style={{ fontSize: "1.6rem", margin: "20px 0", minHeight: "3rem" }}>
        {message}
      </div>
      <ProgressBar
        progressPercent={progressPercent}
        steps={IMPORTANT_STEPS.map(function (step) {
          return { id: step.id.toString(), label: step.label };
        })}
        progressSteps={progressSteps}
      />
      <div style={{ marginTop: "50px" }}>
        {indicatorState && <SyncIcon indicatorState={indicatorState} />}
      </div>
    </div>
  );
};

export default ProcessVideoWebSocket;

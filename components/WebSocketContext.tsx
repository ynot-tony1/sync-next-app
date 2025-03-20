"use client";
import React, {createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { Step, IndicatorState, WebSocketContextType } from "@/types/web-socket-props";

/**
 * The React context for WebSocket state.
 *
 * @constant
 * @type {React.Context<WebSocketContextType | undefined>}
 */
const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

/**
 * An array of important progress steps that are used to parse incoming messages.
 *
 * @constant
 * @type {Step[]}
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
  { id: "9", matchText: "orange", label: "Complete" },
];

interface WebSocketProviderProps {
  children: ReactNode;
}

/**
 * Hook that provides access to the WebSocket context.
 *
 * @throws Will throw an error if used outside of a WebSocketProvider.
 * @returns {WebSocketContextType} The current WebSocket context value.
 *
 * @example
 * const { message, progressSteps } = useWebSocket();
 */
export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};


/**
 * WebSocketProvider component that establishes and manages a WebSocket connection,
 * processes incoming messages, and provides state values via React context.
 *
 * @param {Object} props - Component props.
 * @param {ReactNode} props.children - The child components that require access to WebSocket context.
 * @returns {JSX.Element} A provider component that supplies WebSocket state to its children.
 *
 * @example
 * <WebSocketProvider>
 *   <MyComponent />
 * </WebSocketProvider>
 */
export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [message, setMessage] = useState("");
  const [progressSteps, setProgressSteps] = useState<string[]>([]);
  const [indicatorState, setIndicatorState] = useState<IndicatorState>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);

  useEffect(() => {
    const connectWS = () => {
      const ws = new WebSocket("ws://localhost:8000/ws");
      ws.onopen = () => setWsConnected(true);
      ws.onmessage = (e: MessageEvent<string>) => {
        messageQueue.current.push(e.data);
      };
      ws.onclose = () => {
        setWsConnected(false);
        setTimeout(connectWS, 5000);
      };
      ws.onerror = (e: Event) => {
        console.error("WS error:", e);
        ws.close();
      };
      wsRef.current = ws;
    };
    const timeout = setTimeout(connectWS, 1000);
    return () => {
      clearTimeout(timeout);
      wsRef.current?.close();
    };
  }, []);

  useEffect(() => {
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
        const matchedStep = IMPORTANT_STEPS.find((step: Step) =>
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
  const value: WebSocketContextType = { message, progressSteps, indicatorState, wsConnected, progressPercent };
  return <WebSocketContext.Provider value={value}>{children}</WebSocketContext.Provider>;
};


"use client";

import { useEffect, useState, useRef } from "react";

const DebugLog = () => {
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createWebSocket = () => {
    const ws = new WebSocket("ws://localhost:8000/ws");

    ws.onopen = () => {
      console.log("WS open");
      // Clear any previous reconnect attempts
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }
      // Start heartbeat to keep connection alive (ping every 20 seconds)
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send("ping");
        }
      }, 20000);
    };

    ws.onmessage = (e) => {
      // Push the message to the queue
      messageQueue.current.push(e.data);
    };

    ws.onclose = () => {
      console.log("WS closed");
      cleanupHeartbeat();
      attemptReconnect();
    };

    ws.onerror = (e) => {
      console.error("WS error:", e);
      ws.close(); // Ensure closure triggers onclose
    };

    wsRef.current = ws;
  };

  const cleanupHeartbeat = () => {
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  };

  const attemptReconnect = () => {
    if (!reconnectIntervalRef.current) {
      reconnectIntervalRef.current = setInterval(() => {
        console.log("Attempting to reconnect...");
        createWebSocket();
      }, 5000); // Try reconnecting every 5 seconds
    }
  };

  // Open WebSocket on mount
  useEffect(() => {
    const timerId = setTimeout(() => {
      createWebSocket();
    }, 500);

    return () => {
      clearTimeout(timerId);
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
      }
      cleanupHeartbeat();
    };
  }, []);

  // Every 1000ms, update the displayed message from the queue.
  useEffect(() => {
    const id = setInterval(() => {
      if (messageQueue.current.length > 0) {
        setMessage(messageQueue.current.shift() || "");
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Helper functions to classify messages.
  const isError = (msg: string) =>
    /no video|couldnt find any video stream|no audio|already in sync|already synchronized|could not retrieve fps|error occurred|aborting process/i.test(msg);
  const isSuccess = (msg: string) =>
    /download your file|and we're done|done|thanks/i.test(msg);

  // Indicator components.
  const Spinner = () => (
    <div style={{
      border: "16px solid #f3f3f3",
      borderTop: "16px solid #3498db",
      borderRadius: "50%",
      width: "120px",
      height: "120px",
      animation: "spin 2s linear infinite",
      marginTop: "20px"
    }} />
  );
  const ErrorIndicator = () => (
    <div style={{
      width: "120px",
      height: "120px",
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "red",
      borderRadius: "50%"
    }}>X</div>
  );
  const SuccessIndicator = () => (
    <div style={{
      width: "120px",
      height: "120px",
      marginTop: "20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "3rem",
      fontWeight: "bold",
      color: "white",
      backgroundColor: "green",
      borderRadius: "50%"
    }}>✓</div>
  );

  // Store the indicator elements in refs so they're created only once.
  const spinnerRef = useRef(<Spinner />);
  const errorIndicatorRef = useRef(<ErrorIndicator />);
  const successIndicatorRef = useRef(<SuccessIndicator />);

  // Determine which indicator to display based on the current message.
  let indicator = null;
  if (message) {
    if (isError(message)) {
      indicator = errorIndicatorRef.current;
    } else if (isSuccess(message)) {
      indicator = successIndicatorRef.current;
    } else {
      indicator = spinnerRef.current;
    }
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#f4f4f4",
      textAlign: "center",
      color: "black",
      padding: "10px"
    }}>
      <div style={{ fontSize: "3rem", minHeight: "4rem" }}>{message}</div>
      {indicator}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default DebugLog;

"use client";

import { useEffect, useState, useRef } from "react";

/**
 * ProcessVideoWebSocket component establishes a WebSocket connection to receive video processing messages.
 *
 * The component connects to a WebSocket server at "ws://localhost:8000/ws" and maintains a message queue.
 * It periodically updates the displayed message from the queue.
 *
 * @returns {JSX.Element} The rendered component.
 */

  const ProcessVideoWebSocket = () => {
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);


  useEffect(() => {
    /**
     * Establishes a WebSocket connection and sets up event handlers for connection events.
     *
     * - onopen: Logs when the WebSocket connection is open.
     * - onmessage: Pushes received data into the message queue.
     * - onclose: Logs the closure and attempts to reconnect after 5 seconds.
     * - onerror: Logs errors and closes the WebSocket.
     *
     * @returns {void}
     */
    const connectWS = (): void => {
      const ws = new WebSocket("ws://localhost:8000/ws");
      ws.onopen = () => {
        console.log("WS open");
      };
      ws.onmessage = (e: MessageEvent) => {
        messageQueue.current.push(e.data);
      };
      ws.onclose = () => {
        console.log("WS closed, reconnecting in 5s...");
        setTimeout(connectWS, 5000);
      };
      ws.onerror = (e: Event) => {
        console.error("WS error:", e);
        ws.close();
      };
      wsRef.current = ws;
    };

    const connectTimeout = setTimeout(connectWS, 1000);
    const intervalId = window.setInterval(() => {
      if (messageQueue.current.length) {
        setMessage(messageQueue.current.shift() || "");
      }
    }, 800);

    return () => {
      clearTimeout(connectTimeout);
      wsRef.current?.close();
      clearInterval(intervalId);
    };
  }, []);

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
    </div>
  );
};

export default ProcessVideoWebSocket;

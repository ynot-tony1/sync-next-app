"use client";

import { useEffect, useState, useRef, useCallback } from "react";


const ProcessVideoWebSocket = () => {
  const [message, setMessage] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const messageQueue = useRef<string[]>([]);
  const reconnectIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const createWebSocket = useCallback(() => {
    const ws = new WebSocket("ws://localhost:8000/ws");
    ws.onopen = () => {
      console.log("WS open");
      if (reconnectIntervalRef.current) {
        clearInterval(reconnectIntervalRef.current);
        reconnectIntervalRef.current = null;
      }
    };

    ws.onmessage = (e) => {
      messageQueue.current.push(e.data);
    };

    ws.onclose = () => {
      console.log("WS closed");
      if (!reconnectIntervalRef.current) {
        reconnectIntervalRef.current = setInterval(() => {
          console.log("Attempting to reconnect...");
          createWebSocket();
        }, 5000);
      }
    };

    ws.onerror = (e) => {
      console.error("WS error:", e);
      ws.close();
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      createWebSocket();
    }, 500);

    return () => {
      clearTimeout(timerId);
      if (wsRef.current) wsRef.current.close();
      if (reconnectIntervalRef.current) clearInterval(reconnectIntervalRef.current);
    };
  }, [createWebSocket]);

  useEffect(() => {
    const id = setInterval(() => {
      if (messageQueue.current.length > 0) {
        const nextMsg = messageQueue.current.shift() || "";
        setMessage(nextMsg);
        if (/already in sync|already synchronized/i.test(nextMsg)) {
          messageQueue.current = [];
          return;
        }
        if (/(no video|couldn'?t find any video stream|no audio|could not retrieve fps|error|aborting process)/i.test(nextMsg)) {
          messageQueue.current = [];
          return;
        } 
        if (/download your file/i.test(nextMsg)) {
        } else {
        }
      }
    }, 1000);
  
    return () => clearInterval(id);
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

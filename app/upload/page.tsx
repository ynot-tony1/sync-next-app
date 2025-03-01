"use client";

import React from "react";
import UploadForm from "@/components/UploadForm";
import ProcessVideoWebSocket from "@/components/ProcessVideoWebSocket";
import { WebSocketProvider } from "@/components/WebSocketContext";

export default function UploadPage() {
  return (
    <WebSocketProvider>
      <div className="text-center p-4">
        <UploadForm />
        {/* Only render progress bar in detailed phase (for example) */}
        <ProcessVideoWebSocket visible={true} />
      </div>
    </WebSocketProvider>
  );
}

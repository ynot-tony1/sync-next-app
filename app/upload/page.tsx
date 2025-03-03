"use client";
import React from "react";
import UploadForm from "@/components/UploadForm";
import ProcessVideoWebSocket from "@/components/ProcessVideoWebSocket";
import { WebSocketProvider } from "@/components/WebSocketContext";

import { UploadFileProvider } from "@/components/UploadFileContext";

export default function UploadPage() {
  return (
    <WebSocketProvider>
      <UploadFileProvider>
        <div className="text-center p-4">
          <UploadForm />
          <ProcessVideoWebSocket visible={true} />
        </div>
      </UploadFileProvider>
    </WebSocketProvider>
  );
}

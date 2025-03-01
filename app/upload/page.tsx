"use client";

import UploadForm from "@/components/UploadForm";
import ProcessVideoWebSocket from "@/components/ProcessVideoWebSocket";


export default function UploadPage() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <UploadForm />
      <ProcessVideoWebSocket />
    </div>
  );
}
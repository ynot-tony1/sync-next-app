"use client";

import UploadForm from "@/components/UploadForm";
import WebSockets from "@/components/WebSockets";


export default function UploadPage() {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>Upload a .AVI File</h1>
      <UploadForm />
      <WebSockets />
    </div>
  );
}
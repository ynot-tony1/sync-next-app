"use client";

import React from "react";
import { SyncIconProps } from "types/sync-icon-props";

const SyncIcon: React.FC<SyncIconProps> = ({ indicatorState }) => {
  const Spinner = () => (
    <>
      <div
        style={{
          border: "10px solid #f3f3f3",
          borderTop: "10px solid #1f618d",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          animation: "spin 1.2s linear infinite",
        }}
      />
      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );

  const ErrorIndicator = () => (
    <div
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "2rem",
        fontWeight: "bold",
        color: "white",
        borderRadius: "50%",
        background: `repeating-linear-gradient(
          45deg,
          #ba4a00,
          #ba4a00 4px,
          #a03e00 4px,
          #a03e00 8px
        )`,
      }}
    >
      X
    </div>
  );

  const SuccessIndicator = () => (
    <div
      style={{
        width: "60px",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "60px",
        color: "white",
        fontWeight: "bold",
        background: `repeating-linear-gradient(
          45deg,
          #1a5276,
          #1a5276 4px,
          #163e5b 4px,
          #163e5b 8px
        )`,
      }}
    >
      ✓
    </div>
  );

  if (indicatorState === "error") {
    return <ErrorIndicator />;
  } else if (indicatorState === "success") {
    return <SuccessIndicator />;
  } else {
    return <Spinner />;
  }
};

export default React.memo(SyncIcon);

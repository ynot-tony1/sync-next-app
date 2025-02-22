"use client";

import React from "react";
import { ProgressBarProps } from "types/progress-bar";

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  steps = [],
  progressSteps,
}) => {
  return (
    <div style={{ width: "100%", maxWidth: "600px" }}>
      <div
        style={{
          backgroundColor: "#d9d9d9",
          borderRadius: "15px",
          overflow: "hidden",
          height: "25px",
          marginBottom: "40px",
          width: "100%",
        }}
      >
        <div
          style={{
            width: `${progressPercent}%`,
            backgroundColor: "#bdb5b0",
            height: "100%",
            transition: "width 0.5s ease-in-out",
          }}
        />
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {steps.map((step) => {
          const stepDone = progressSteps.includes(step.label);
          return (
            <div
              key={step.id}
              style={{
                display: "flex",
                alignItems: "center",
                margin: "5px 8px",
                color: stepDone ? "#ba4a00" : "#777",
                fontWeight: stepDone ? "bold" : "normal",
              }}
            >
              <span
                style={{
                  marginRight: "5px",
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  borderRadius: "50%",
                  backgroundColor: stepDone ? "#ba4a00" : "#ccc",
                  textAlign: "center",
                  color: "white",
                  lineHeight: "16px",
                  fontSize: "12px",
                }}
              >
                {stepDone ? "✓" : ""}
              </span>
              {step.label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressBar;

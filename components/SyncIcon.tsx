/**
 * @module SyncIcon
 * @description Renders a visual indicator for sync status including error, success, and a circular spinner for syncing.
 */

import React from "react";
import { SyncIconProps } from "types/sync-icon-props";

/**
 * Filters out the "jsx" property from a props object.
 *
 * @param props - The props object to filter.
 * @returns A new object without the "jsx" property.
 */
const filterProps = (props: Record<string, unknown>): Record<string, unknown> => {
  const { jsx: _jsx, ...filtered } = props;
  return filtered;
};

/**
 * SyncIcon Component.
 *
 * Renders an indicator based on the provided sync status.
 *
 * @param indicatorState - The current sync status ("error", "success", or "syncing").
 * @param props - Additional properties to pass to the root element.
 * @returns A JSX element representing the sync indicator.
 */
const SyncIcon: React.FC<SyncIconProps> = ({ indicatorState, ...props }) => {
  const safeProps = filterProps(props);

  if (indicatorState === "error") {
    return (
      <div
        {...safeProps}
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
          backgroundColor: "#ba4a00",
        }}
      >
        X
      </div>
    );
  } else if (indicatorState === "success") {
    return (
      <div
        {...safeProps}
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
          backgroundColor: "#ba4a00",
        }}
      >
        ✓
      </div>
    );
  } else if (indicatorState === "syncing") {
    return (
      <>
        <div {...safeProps} className="spinner-container">
          <div className="spinner" />
        </div>
        <style jsx>{`
          .spinner-container {
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            box-sizing: border-box;
          }
          .spinner {
            width: 60px;
            height: 60px;
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-top: 4px solid #ba4a00; /* Burnt orange */
            border-radius: 50%;
            box-sizing: border-box;
            animation: spin 1s linear infinite;
          }
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
  }
  return null;
};

export default SyncIcon;
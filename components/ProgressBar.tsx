/**
 * ProgressBar Component.
 *
 * @remarks
 * Displays a visual progress bar based on the given percentage and an array of steps.
 * Each step is rendered with a label and an indicator showing whether the step has been completed.
 *
 * @param {ProgressBarProps} props - The properties for the progress bar component.
 * @param {number} props.progressPercent - The percentage of progress to display.
 * @param {Array} props.steps - An array of step objects to display in the progress bar.
 * @param {string[]} props.progressSteps - An array of step labels that have been completed.
 * @returns {JSX.Element} The rendered progress bar.
 */
"use client";
import React from "react";
import { ProgressBarProps } from "types/progress-bar";

const ProgressBar: React.FC<ProgressBarProps> = ({
  progressPercent,
  steps = [],
  progressSteps,
}) => {
  return (
    <div className="w-full max-w-lg">
      <div className="bg-gray-300 rounded-full overflow-hidden h-6 mb-10 w-full">
        <div
          className="bg-burntorange h-full transition-all duration-500 ease-in-out"
          style={{ width: `${Math.min(progressPercent, 100)}%` }}
        />
      </div>

      <div className="flex flex-wrap justify-center">
        {steps.map((step) => {
          const stepDone = progressSteps.includes(step.label);
          return (
            <div
              key={step.id}
              className={`flex items-center m-2 text-sm ${
                stepDone ? "text-burntorange font-bold" : "text-gray-500"
              }`}
            >
              <span
                className={`mr-2 flex items-center justify-center w-4 h-4 rounded-full ${
                  stepDone ? "bg-burntorange text-white" : "bg-gray-400"
                }`}
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

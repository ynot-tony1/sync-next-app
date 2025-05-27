export interface ProgressBarStep {
  id: string;
  label: string;
}

export interface ProgressBarProps {
  progressPercent: number;
  steps: ProgressBarStep[];
  progressSteps: string[];
}

export interface Step {
    id: string;
    matchText: string;
    label: string;
  }
  
  export type IndicatorState = "syncing" | "error" | "success" | null;
  
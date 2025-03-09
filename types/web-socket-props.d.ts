export interface Step {
    id: string;
    matchText: string;
    label: string;
  }
  
  export type IndicatorState = "syncing" | "error" | "success" | null;

  export interface WebSocketContextType {
    message: string;
    progressSteps: string[];
    indicatorState: IndicatorState;
    wsConnected: boolean;
    progressPercent: number;
  }
  
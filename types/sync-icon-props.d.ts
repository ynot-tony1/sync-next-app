export interface SyncIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'jsx'> {
  indicatorState: "success" | "error" | "syncing";
}

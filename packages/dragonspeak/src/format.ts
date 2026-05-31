export const formatEventTime = (timestamp: number) =>
  new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(timestamp);

export const percentage = (value: number) => `${Math.min(100, Math.max(0, value))}%`;

export const hourClock = (): string => {
  const time = new Date();
  return time.toLocaleString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

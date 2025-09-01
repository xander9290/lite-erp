export const hourClock = (): string => {
  const time = new Date();
  return time.toLocaleString("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDate = (date: Date | string | number | null) => {
  if (!date || date === "") return null;
  const d = new Date(date);
  return d.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
};

export const parserDate = (date: Date) => {
  return new Date(date).toISOString().slice(0, 16) || new Date();
};

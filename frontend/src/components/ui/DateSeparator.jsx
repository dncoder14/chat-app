const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export const formatDateLabel = (date) => {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";

  const withinWeek = today - d < 6 * 24 * 60 * 60 * 1000;
  if (withinWeek) {
    return d.toLocaleDateString("en-US", { weekday: "long" });
  }

  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
};

const DateSeparator = ({ date }) => (
  <div className="flex items-center justify-center my-4">
    <span className="px-3 py-1 text-xs font-medium text-muted bg-surface-secondary rounded-full">
      {formatDateLabel(date)}
    </span>
  </div>
);

export default DateSeparator;

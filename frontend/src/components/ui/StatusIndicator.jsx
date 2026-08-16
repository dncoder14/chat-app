const sizeClasses = {
  sm: "w-2.5 h-2.5 border",
  md: "w-3 h-3 border-2",
};

const StatusIndicator = ({ online, size = "md", className = "" }) => {
  return (
    <span
      aria-hidden="true"
      className={`absolute bottom-0 right-0 ${sizeClasses[size]} rounded-full border-surface ${
        online ? "bg-success" : "bg-muted/50"
      } ${className}`}
    />
  );
};

export default StatusIndicator;

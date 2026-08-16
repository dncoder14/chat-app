import StatusIndicator from "./ui/StatusIndicator";

const Avatar = ({ src, name, size = "w-10 h-10", className = "", online }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.trim().split(" ").filter(Boolean);
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  return (
    <span className={`relative inline-flex shrink-0 ${size}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`w-full h-full object-cover rounded-full ${className}`}
        />
      ) : (
        <span
          className={`w-full h-full bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm ${className}`}
        >
          {getInitials(name)}
        </span>
      )}
      {typeof online !== "undefined" && <StatusIndicator online={online} />}
    </span>
  );
};

export default Avatar;

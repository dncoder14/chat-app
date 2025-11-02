const Avatar = ({ src, name, size = "w-10 h-10", className = "" }) => {
  const getInitials = (fullName) => {
    if (!fullName) return "U";
    const names = fullName.split(" ");
    if (names.length >= 2) {
      return (names[0][0] + names[1][0]).toUpperCase();
    }
    return names[0][0].toUpperCase();
  };

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${size} object-cover rounded-full ${className}`}
      />
    );
  }

  return (
    <div className={`${size} bg-primary-500 text-white rounded-full flex items-center justify-center font-semibold ${className}`}>
      {getInitials(name)}
    </div>
  );
};

export default Avatar;
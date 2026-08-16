const sizes = {
  sm: { img: "w-6 h-6", text: "text-base" },
  md: { img: "w-8 h-8", text: "text-xl" },
  lg: { img: "w-12 h-12", text: "text-2xl" },
};

const AppLogo = ({ size = "md", showName = true, className = "" }) => {
  const { img, text } = sizes[size];
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img src="/logo.png" alt="Orango" className={`${img} rounded-lg`} />
      {showName && (
        <span className={`${text} font-bold text-foreground tracking-tight`}>Orango</span>
      )}
    </div>
  );
};

export default AppLogo;

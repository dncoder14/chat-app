const sizeClasses = {
  sm: "p-1.5",
  md: "p-2",
  lg: "p-2.5",
};

const iconSizeClasses = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-5 h-5",
};

const variantClasses = {
  default: "text-muted hover:text-foreground hover:bg-surface-secondary",
  danger: "text-danger hover:bg-danger/10",
  primary: "text-primary hover:bg-primary-soft",
};

const IconButton = ({
  icon: Icon,
  label,
  onClick,
  variant = "default",
  size = "md",
  active = false,
  disabled = false,
  type = "button",
  className = "",
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`${sizeClasses[size]} rounded-md transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed ${
        active ? "bg-primary-soft text-primary" : variantClasses[variant]
      } ${className}`}
    >
      <Icon className={iconSizeClasses[size]} />
    </button>
  );
};

export default IconButton;

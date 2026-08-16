const toneClasses = {
  default: "text-muted bg-surface-secondary",
  danger: "text-danger bg-danger/10",
  primary: "text-primary bg-primary-soft",
};

const SettingsRow = ({ icon: Icon, title, description, action, tone = "default" }) => {
  return (
    <div className="flex items-center gap-3 px-5 py-4">
      {Icon && (
        <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 ${toneClasses[tone]}`}>
          <Icon className="w-4 h-4" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description && <p className="text-xs text-muted mt-0.5">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
};

export default SettingsRow;

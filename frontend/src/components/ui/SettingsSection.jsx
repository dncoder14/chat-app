const SettingsSection = ({ title, children, className = "" }) => (
  <div className={`bg-surface rounded-lg shadow-sm border border-border overflow-hidden ${className}`}>
    {title && (
      <div className="px-5 pt-4 pb-2">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-muted">{title}</h2>
      </div>
    )}
    <div className="divide-y divide-border">{children}</div>
  </div>
);

export default SettingsSection;

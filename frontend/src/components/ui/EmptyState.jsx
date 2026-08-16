const EmptyState = ({ icon: Icon, title, description, action, className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center px-6 py-10 ${className}`}>
      {Icon && (
        <div className="w-12 h-12 rounded-full bg-surface-secondary flex items-center justify-center mb-4">
          <Icon className="w-6 h-6 text-muted" />
        </div>
      )}
      {title && <h3 className="text-sm font-semibold text-foreground mb-1">{title}</h3>}
      {description && <p className="text-sm text-muted max-w-xs">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};

export default EmptyState;

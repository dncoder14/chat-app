import { Zap, Shield, Image as ImageIcon } from "lucide-react";
import AppLogo from "./ui/AppLogo";

const HIGHLIGHTS = [
  { icon: Zap, label: "Real-time messaging" },
  { icon: Shield, label: "Secure conversations" },
  { icon: ImageIcon, label: "Share files & media" },
];

const AuthShowcase = () => {
  return (
    <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden bg-background">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(900px circle at 20% 25%, rgb(var(--color-primary-rgb) / 0.06), transparent 65%)",
        }}
      />

      <div className="relative flex flex-col justify-center mx-auto px-16 xl:px-24 py-16 max-w-2xl">
        <AppLogo size="lg" />
        <p className="mt-3 text-sm font-medium text-primary">Smart Chat. Smarter Connections.</p>

        <h1 className="mt-8 text-4xl font-bold text-foreground leading-tight">
          Conversations that just flow.
        </h1>
        <p className="mt-4 text-base text-muted leading-relaxed max-w-md">
          Orango is a modern, secure real-time chat platform built for fast, reliable
          conversations — with contacts, media sharing, and stories, all in one place.
        </p>

        <div className="mt-10 space-y-5">
          {HIGHLIGHTS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthShowcase;

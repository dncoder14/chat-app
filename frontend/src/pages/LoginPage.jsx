import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Lock, Loader2, AlertCircle } from "lucide-react";
import AuthShowcase from "../components/AuthShowcase";
import AppLogo from "../components/ui/AppLogo";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = ({ email, password }) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = "Please enter a valid email address.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }
  return errors;
};

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const { login, isLoggingIn } = useAuthStore();

  const handleChange = (field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => (prev[field] || prev.general ? { ...prev, [field]: undefined, general: undefined } : prev));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoggingIn) return;

    const nextErrors = validate(formData);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    await login({ ...formData, remember: rememberMe });

    if (!useAuthStore.getState().authUser) {
      setErrors({ general: "Invalid email or password. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      <AuthShowcase />

      <div className="relative flex-1 flex flex-col items-center justify-center px-5 py-6 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(640px circle at 50% 38%, rgb(var(--color-primary-rgb) / 0.07), transparent 70%)",
          }}
        />

        <div className="relative w-full max-w-md lg:max-w-[420px]">
          <div className="lg:hidden flex flex-col items-center mb-6">
            <AppLogo size="md" />
            <p className="mt-2 text-sm font-medium text-primary">Smart Chat. Smarter Connections.</p>
          </div>

          <div className="bg-surface rounded-2xl shadow-sm border border-border p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
              <p className="text-sm text-muted mt-1">Sign in to your smart chat experience</p>
            </div>

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {errors.general && (
                <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger/10 text-danger text-sm">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-3.5 py-2.5 border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                    errors.email ? "border-danger focus:ring-danger" : "border-border focus:ring-primary"
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email && (
                  <p id="email-error" className="mt-1.5 text-xs text-danger">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    className={`w-full px-3.5 py-2.5 pr-11 border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                      errors.password ? "border-danger focus:ring-danger" : "border-border focus:ring-primary"
                    }`}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange("password")}
                    aria-invalid={Boolean(errors.password)}
                    aria-describedby={errors.password ? "password-error" : undefined}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-xs text-danger">
                    {errors.password}
                  </p>
                )}
              </div>

              <div className="flex items-center -mt-1">
                <label className="flex items-center gap-2 text-sm text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                  />
                  Remember me
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isLoggingIn && <Loader2 className="w-4 h-4 animate-spin" />}
                {isLoggingIn ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-muted">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:text-primary-hover font-semibold transition-colors">
                Sign up
              </Link>
            </p>
          </div>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-xs text-muted">
            <Lock className="w-3 h-3" />
            Secured sign-in
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

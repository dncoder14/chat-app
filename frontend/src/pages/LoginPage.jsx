import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Lock, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import AuthShowcase from "../components/AuthShowcase";
import AppLogo from "../components/ui/AppLogo";

// Matches the backend's resend cooldown (RESEND_COOLDOWN_MS in otpStore.js).
const RESEND_COOLDOWN_SECONDS = 30;

const LoginPage = () => {
  const [step, setStep] = useState("phone"); // phone | otp | name
  const [phone, setPhone] = useState();
  const [otp, setOtp] = useState("");
  const [fullName, setFullName] = useState("");
  const [errors, setErrors] = useState({});
  const [resendIn, setResendIn] = useState(0);

  const { sendOtp, isSendingOtp, verifyOtp, isVerifyingOtp } = useAuthStore();

  useEffect(() => {
    if (step !== "otp" || resendIn === 0) return;
    const timer = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [step, resendIn]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (isSendingOtp) return;
    if (!phone || !isValidPhoneNumber(phone)) {
      setErrors({ phone: "Enter a valid phone number." });
      return;
    }
    setErrors({});
    try {
      const data = await sendOtp(phone);
      // No real SMS vendor wired in yet, so the backend echoes the OTP back
      // in dev mode. Once a vendor (e.g. 2Factor) is connected, `data.otp`
      // won't be present and this alert will simply stop firing.
      if (data.otp) {
        alert(`Your OTP is: ${data.otp}`);
      }
      setOtp("");
      setStep("otp");
      setResendIn(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.log("Error sending OTP:", error);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (isVerifyingOtp) return;
    if (otp.trim().length !== 6) {
      setErrors({ otp: "Enter the 6-digit code." });
      return;
    }
    setErrors({});
    try {
      const data = await verifyOtp({ phone, otp: otp.trim() });
      if (data?.newUser) {
        setStep("name");
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid or expired code. Please try again." });
    }
  };

  const handleCompleteSignup = async (e) => {
    e.preventDefault();
    if (isVerifyingOtp) return;
    if (!fullName.trim()) {
      setErrors({ fullName: "Full name is required." });
      return;
    }
    setErrors({});
    try {
      await verifyOtp({ phone, otp: otp.trim(), fullName: fullName.trim() });
    } catch (error) {
      console.log("Error completing signup:", error);
    }
  };

  const backToPhoneStep = () => {
    setStep("phone");
    setOtp("");
    setErrors({});
    setResendIn(0);
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
            {step === "phone" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
                  <p className="text-sm text-muted mt-1">Sign in with your phone number</p>
                </div>

                <form onSubmit={handleSendOtp} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-1.5">
                      Phone Number
                    </label>
                    <PhoneInput
                      id="phone"
                      international
                      defaultCountry="IN"
                      value={phone}
                      onChange={setPhone}
                      placeholder="Enter your phone number"
                      className={`phone-input-field ${errors.phone ? "phone-input-error" : ""}`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs text-danger">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSendingOtp}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSendingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isSendingOtp ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              </>
            )}

            {step === "otp" && (
              <>
                <button
                  onClick={backToPhoneStep}
                  className="flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-4"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Change number
                </button>

                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">Enter Code</h1>
                  <p className="text-sm text-muted mt-1">We sent a 6-digit code to {phone}</p>
                </div>

                <form onSubmit={handleVerifyOtp} noValidate className="space-y-5">
                  {errors.otp && (
                    <div className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-danger/10 text-danger text-sm">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errors.otp}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="otp" className="block text-sm font-medium text-foreground mb-1.5">
                      Verification Code
                    </label>
                    <input
                      id="otp"
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      autoComplete="one-time-code"
                      className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-background text-foreground placeholder-muted tracking-[0.3em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isVerifyingOtp ? "Verifying..." : "Verify"}
                  </button>

                  {resendIn > 0 ? (
                    <p className="w-full text-center text-sm text-muted">
                      Resend code in <span className="font-medium text-foreground">{resendIn}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isSendingOtp}
                      className="w-full text-center text-sm text-primary hover:text-primary-hover font-semibold transition-colors disabled:opacity-60"
                    >
                      {isSendingOtp ? "Resending..." : "Resend code"}
                    </button>
                  )}
                </form>
              </>
            )}

            {step === "name" && (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-foreground">Almost There</h1>
                  <p className="text-sm text-muted mt-1">Tell us your name to finish creating your account</p>
                </div>

                <form onSubmit={handleCompleteSignup} noValidate className="space-y-5">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      className={`w-full px-3.5 py-2.5 border rounded-lg bg-background text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:border-transparent transition-colors ${
                        errors.fullName ? "border-danger focus:ring-danger" : "border-border focus:ring-primary"
                      }`}
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    {errors.fullName && (
                      <p className="mt-1.5 text-xs text-danger">{errors.fullName}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isVerifyingOtp}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover active:bg-primary-hover text-white font-semibold py-2.5 px-4 rounded-lg transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isVerifyingOtp && <Loader2 className="w-4 h-4 animate-spin" />}
                    {isVerifyingOtp ? "Creating account..." : "Continue"}
                  </button>
                </form>
              </>
            )}
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

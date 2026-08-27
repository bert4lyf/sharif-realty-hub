import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { LockKeyhole, Mail, User, Phone, CheckCircle, ArrowRight, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdmin } from "@/lib/admin-store";
import { OFFICIAL_MEDIA } from "@/lib/media";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign In / Register | Sharif Realty Group" },
      {
        name: "description",
        content:
          "Access your Sharif Realty Client Portal to track favorite properties, inquiry status, and schedule private showings.",
      },
    ],
  }),
  component: SignInPage,
});

export function SignInPage() {
  const { signIn, signUp, user, ready } = useAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Register form state
  const [regFullName, setRegFullName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regPasswordConfirm, setRegPasswordConfirm] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [registerError, setRegisterError] = useState<string | null>(null);

  // Forgot password modal
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  useEffect(() => {
    if (ready && user) {
      if (user.role === "Admin" || user.role === "Agent" || user.role === "Administrator") {
        void navigate({ to: "/admin/dashboard", replace: true });
      } else {
        void navigate({ to: "/dashboard", replace: true });
      }
    }
  }, [ready, user, navigate]);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError(null);
    setIsSubmitting(true);

    const result = signIn(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!result.ok) {
      setLoginError(result.message ?? "Invalid email or password.");
      toast.error(result.message ?? "Invalid credentials. Please try again.");
      return;
    }

    toast.success("Welcome back! Redirecting...");
    if (result.user?.role === "Admin" || result.user?.role === "Agent" || result.user?.role === "Administrator") {
      void navigate({ to: "/admin/dashboard", replace: true });
    } else {
      void navigate({ to: "/dashboard", replace: true });
    }
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setRegisterError(null);

    if (!agreeTerms) {
      toast.error("Please agree to the Terms of Service & Privacy Policy.");
      return;
    }

    if (regPassword !== regPasswordConfirm) {
      setRegisterError("Passwords do not match. Please re-enter your password.");
      toast.error("Passwords do not match.");
      return;
    }

    if (regPassword.length < 6) {
      setRegisterError("Password must be at least 6 characters.");
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setIsSubmitting(true);
    const result = signUp(regFullName, regEmail, regPassword, regPhone, "Client");
    setIsSubmitting(false);

    if (!result.ok) {
      setRegisterError(result.message ?? "Registration failed.");
      toast.error(result.message ?? "Registration failed.");
      return;
    }

    toast.success("Account created successfully! Welcome to Sharif Realty.");
    void navigate({ to: "/dashboard", replace: true });
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your registered email address.");
      return;
    }
    setForgotSubmitted(true);
    toast.success("Password reset instructions dispatched to your email.");
  }

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-white dark:bg-slate-950 font-sans antialiased selection:bg-[#0F172A] selection:text-white">
      {/* LEFT COLUMN: 50% High-Resolution Cover Image */}
      <div className="relative hidden lg:flex lg:w-1/2 min-h-screen flex-col justify-between p-12 overflow-hidden bg-slate-950">
        {/* Full-bleed background estate image */}
        <img
          src="/wp-content/uploads/image-16.png"
          alt="Sharif Realty Luxury Estate"
          className="absolute inset-0 size-full object-cover object-center brightness-75 scale-105 transition-transform duration-10000 hover:scale-100"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=85";
          }}
        />

        {/* Gradient Overlay for high-end contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#001426] via-[#001426]/60 to-transparent" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Top Branding in Left Column */}
        <div className="relative z-10">
          <Link to="/" className="inline-block group">
            <div className="bg-white p-3 rounded-2xl shadow-2xl transition-transform group-hover:scale-105 inline-block">
              <img
                src={OFFICIAL_MEDIA.logo}
                alt="Sharif Realty Group"
                className="h-12 sm:h-14 w-auto object-contain"
              />
            </div>
          </Link>
        </div>

        {/* Bottom Tagline & Credibility Ribbon */}
        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="space-y-3">
            <span className="inline-block px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[#C5A880] text-xs font-bold uppercase tracking-wider border border-white/15">
              Client & Member Portal
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white leading-tight drop-shadow-md">
              Unmatched precision in luxury and commercial real estate.
            </h2>
            <p className="text-sm text-slate-200/90 leading-relaxed drop-shadow">
              Sign in to manage your saved properties, track showing schedules, review active inquiries, and communicate directly with principal broker Majeed Sharif.
            </p>
          </div>

          <div className="pt-4 border-t border-white/15 flex items-center gap-6 text-xs text-slate-300 font-medium">
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-emerald-400" />
              <span>Direct Showing Requests</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-2 rounded-full bg-[#C5A880]" />
              <span>Off-Market Access</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: 50% Authentication Form */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center items-center p-6 sm:p-10 lg:p-14 bg-slate-50 dark:bg-slate-950">
        <div className="w-full max-w-md space-y-8">
          {/* Header Logo */}
          <div className="text-center space-y-3">
            <Link to="/" className="inline-block transition-transform hover:scale-105">
              <img
                src={OFFICIAL_MEDIA.logo}
                alt="Sharif Realty Group"
                className="h-14 sm:h-16 w-auto mx-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </Link>
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                {activeTab === "login" ? "Welcome Back" : "Create an Account"}
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                {activeTab === "login"
                  ? "Sign in to access your properties and inquiry dashboard."
                  : "Register as a client to save listings and request showings."}
              </p>
            </div>
          </div>

          {/* Clean 2-Tab Selector */}
          <div className="grid grid-cols-2 p-1 bg-[#F3F0EA] rounded-xl border border-[#EAE6DF] text-xs font-semibold uppercase tracking-wider">
            <button
              type="button"
              onClick={() => {
                setActiveTab("login");
                setLoginError(null);
              }}
              className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === "login"
                  ? "bg-[#0F172A] text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-[#0F172A]"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("register");
                setRegisterError(null);
              }}
              className={`py-2.5 rounded-lg transition-all text-center cursor-pointer ${
                activeTab === "register"
                  ? "bg-[#0F172A] text-white shadow-sm font-semibold"
                  : "text-slate-600 hover:text-[#0F172A]"
              }`}
            >
              Register
            </button>
          </div>

          {/* 1. LOGIN FORM */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              {loginError && (
                <div className="rounded-xl bg-red-50 p-3.5 text-xs text-red-700 border border-red-200 flex items-center gap-2">
                  <span className="font-semibold">{loginError}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <Label
                  htmlFor="login-email"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="login-email"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="h-11 pl-10 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 placeholder:text-slate-400 rounded-xl text-xs focus:border-[#C5A880] focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="login-password"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700"
                  >
                    Password
                  </Label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(loginEmail);
                      setForgotSubmitted(false);
                      setShowForgotModal(true);
                    }}
                    className="text-xs font-semibold text-[#B38B59] hover:underline focus:outline-none cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="login-password"
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 pl-10 border-[#EAE6DF] bg-[#FAF8F5] text-slate-900 placeholder:text-slate-400 rounded-xl text-xs focus:border-[#C5A880] focus:ring-[#C5A880]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember-me"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(Boolean(checked))}
                  />
                  <Label
                    htmlFor="remember-me"
                    className="text-xs text-slate-600 cursor-pointer"
                  >
                    Remember this device
                  </Label>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider shadow-sm rounded-xl transition-all cursor-pointer"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Don't have an account yet?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("register")}
                  className="font-bold text-[#B38B59] hover:underline cursor-pointer"
                >
                  Create Client Account
                </button>
              </div>
            </form>
          )}

          {/* 2. REGISTER FORM */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {registerError && (
                <div className="rounded-xl bg-red-50 dark:bg-red-950/40 p-3 text-xs text-[#B38B59] border border-red-200 dark:border-red-900/50">
                  {registerError}
                </div>
              )}

              <div className="space-y-1">
                <Label
                  htmlFor="reg-name"
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                >
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <Input
                    id="reg-name"
                    required
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    placeholder="Eleanor Vance"
                    className="h-10 pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="reg-email"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Email Address *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="reg-email"
                      type="email"
                      required
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="eleanor@example.com"
                      className="h-10 pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="reg-phone"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="reg-phone"
                      type="tel"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      placeholder="(203) 555-0199"
                      className="h-10 pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label
                    htmlFor="reg-pass"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Password *
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="reg-pass"
                      type="password"
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label
                    htmlFor="reg-pass-confirm"
                    className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  >
                    Confirm Password *
                  </Label>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      id="reg-pass-confirm"
                      type="password"
                      required
                      value={regPasswordConfirm}
                      onChange={(e) => setRegPasswordConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 pl-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <Checkbox
                  id="agree-terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) => setAgreeTerms(Boolean(checked))}
                  className="mt-0.5"
                />
                <Label
                  htmlFor="agree-terms"
                  className="text-xs text-slate-600 cursor-pointer leading-snug"
                >
                  I agree to the{" "}
                  <Link to="/terms-and-conditions" className="text-[#B38B59] underline">
                    Terms &amp; Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy-policy" className="text-[#B38B59] underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-11 bg-[#0F172A] hover:bg-[#1E293B] text-white font-semibold text-xs uppercase tracking-wider shadow-sm rounded-xl transition-all cursor-pointer"
              >
                {isSubmitting ? "Creating Account..." : "Create Client Account"}
              </Button>

              <div className="text-center pt-2 text-xs text-slate-500">
                Already registered?{" "}
                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className="font-bold text-[#B38B59] hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </div>
            </form>
          )}

          {/* Footer Back to Home link */}
          <div className="text-center pt-4 border-t border-slate-200 dark:border-slate-800">
            <Link
              to="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            >
              &larr; Return to Sharif Realty Home
            </Link>
          </div>
        </div>
      </div>

      {/* Discrete Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 max-w-md w-full p-6 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                Reset Password
              </h3>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-lg"
              >
                <X className="size-5" />
              </button>
            </div>

            {forgotSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle className="size-8 text-emerald-600 mx-auto" />
                <p className="text-xs text-emerald-800 dark:text-emerald-200 font-semibold">
                  Password reset link has been dispatched to <strong>{forgotEmail}</strong>.
                </p>
                <Button
                  type="button"
                  onClick={() => setShowForgotModal(false)}
                  className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
                >
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <p className="text-slate-500 dark:text-slate-400">
                  Enter the email address associated with your account and we will send you instructions to reset your password.
                </p>
                <div className="space-y-1">
                  <Label htmlFor="forgot-email" className="font-bold text-slate-700 dark:text-slate-300">
                    Email Address
                  </Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="yourname@domain.com"
                    className="h-10 border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-lg"
                  >
                    Cancel
                  </button>
                  <Button
                    type="submit"
                    className="bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold"
                  >
                    Send Reset Link
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

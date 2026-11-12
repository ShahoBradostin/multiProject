"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth, type AuthErrorCode } from "@/lib/auth/AuthContext";

const ERROR_KEYS: Record<AuthErrorCode, string> = {
  usernameTaken: "auth.errorUsernameTaken",
  invalidCredentials: "auth.errorInvalidCredentials",
  generic: "auth.errorGeneric",
};

export default function RegisterPage() {
  const { t } = useLanguage();
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (username.trim().length < 3) {
      setError(t("auth.usernameTooShort"));
      return;
    }
    if (password.length < 8) {
      setError(t("auth.passwordTooShort"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("auth.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    const result = await register(username.trim(), password);
    setSubmitting(false);
    if (!result.ok) {
      setError(t(ERROR_KEYS[result.errorCode]));
      return;
    }
    router.push("/");
  }

  return (
    <AuthLayout>
      <FadeIn className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-serif text-2xl text-foreground">
            {t("auth.registerTitle")}
          </h1>
          <p className="text-sm text-muted">{t("auth.registerDescription")}</p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">
              {t("auth.usernameLabel")}
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              placeholder={t("auth.usernamePlaceholder")}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <label className="text-xs text-muted">
                {t("auth.passwordLabel")}
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPasswordHint((shown) => !shown)}
                  aria-label={t("auth.passwordHintAria")}
                  className="flex h-4 w-4 items-center justify-center rounded-full border border-muted text-[10px] font-bold leading-none text-muted transition-colors hover:border-accent hover:text-accent"
                >
                  !
                </button>
                {showPasswordHint && (
                  <div className="absolute left-1/2 top-full z-10 mt-2 w-48 -translate-x-1/2 rounded-lg bg-white px-3 py-2 text-xs text-gray-900 shadow-lg">
                    {t("auth.passwordTooShort")}
                  </div>
                )}
              </div>
            </div>
            <input
              type="password"
              required
              autoComplete="new-password"
              placeholder={t("auth.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">
              {t("auth.confirmPasswordLabel")}
            </label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={submitting}
            className="rounded-none bg-accent-button px-4 py-2 text-sm font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover disabled:opacity-60"
          >
            {t("auth.submitRegister")}
          </button>
        </form>
        <p className="text-sm text-muted">
          {t("auth.haveAccount")}{" "}
          <Link
            href="/login"
            className="font-medium text-accent hover:underline"
          >
            {t("auth.loginLink")}
          </Link>
        </p>
      </FadeIn>
    </AuthLayout>
  );
}

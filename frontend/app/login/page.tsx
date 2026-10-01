"use client";

import Link from "next/link";
import { Suspense, useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AuthLayout from "@/components/AuthLayout";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { useAuth, type AuthErrorCode } from "@/lib/auth/AuthContext";

const ERROR_KEYS: Record<AuthErrorCode, string> = {
  usernameTaken: "auth.errorUsernameTaken",
  invalidCredentials: "auth.errorInvalidCredentials",
  generic: "auth.errorGeneric",
};

function LoginForm() {
  const { t } = useLanguage();
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<AuthErrorCode | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(username, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.errorCode);
      return;
    }
    router.push(searchParams.get("from") || "/");
  }

  return (
    <FadeIn className="mx-auto flex w-full max-w-sm flex-col gap-4 rounded-2xl border border-border bg-surface p-6">
      <div className="flex flex-col gap-1">
        <h1 className="font-serif text-2xl text-foreground">
          {t("auth.loginTitle")}
        </h1>
        <p className="text-sm text-muted">{t("auth.loginDescription")}</p>
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
          <label className="text-xs text-muted">
            {t("auth.passwordLabel")}
          </label>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent"
          />
        </div>
        {error && <p className="text-sm text-red-600">{t(ERROR_KEYS[error])}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {t("auth.submitLogin")}
        </button>
      </form>
      <p className="text-sm text-muted">
        {t("auth.noAccount")}{" "}
        <Link
          href="/register"
          className="font-medium text-accent hover:underline"
        >
          {t("auth.registerLink")}
        </Link>
      </p>
    </FadeIn>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}

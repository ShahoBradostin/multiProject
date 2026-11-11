"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import FadeIn from "@/components/FadeIn";
import { useLanguage } from "@/lib/i18n/LanguageContext";

// TODO: replace with the real address before shipping.
const CONTACT_EMAIL = "######";

export default function ContactPage() {
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  function handleContactSubmit(e: FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(t("contact.subject", { name }));
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  }

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 px-6 py-10 sm:px-16">
      <Link
        href="/"
        className="inline-flex w-fit items-center gap-1.5 rounded-none border border-border bg-surface px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:border-accent hover:text-accent"
      >
        {t("common.backHome")}
      </Link>

      <FadeIn className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
        <form
          onSubmit={handleContactSubmit}
          className="order-2 flex flex-col gap-3 text-left md:order-1"
        >
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">
              {t("contact.nameLabel")}
            </label>
            <input
              type="text"
              required
              placeholder={t("contact.namePlaceholder")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">
              {t("contact.emailLabel")}
            </label>
            <input
              type="email"
              required
              placeholder={t("contact.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-xs text-muted">
              {t("contact.messageLabel")}
            </label>
            <textarea
              required
              rows={5}
              placeholder={t("contact.messagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="resize-none rounded-lg border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-fit rounded-none bg-accent-button px-4 py-2 text-sm font-medium text-accent-button-foreground transition-colors hover:bg-accent-button-hover"
          >
            {t("contact.submit")}
          </button>
        </form>

        <div className="order-1 flex flex-col gap-2 md:order-2">
          <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground">
            {t("contact.heading")}
          </h1>
          <p className="text-muted">{t("contact.description")}</p>
        </div>
      </FadeIn>
    </div>
  );
}

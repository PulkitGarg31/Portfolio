"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { site } from "@/config/site";
import { Reveal } from "@/components/reveal";

// Web3Forms' free shared hCaptcha sitekey. Public by design: the token it produces is
// verified on Web3Forms' servers, so a valid submission requires actually solving the
// captcha. This (plus the honeypot) is the real bot protection.
const HCAPTCHA_SITEKEY = "50b2fe65-b00b-4b9e-ad62-3ba471098be2";

// Per-browser courtesy throttle. It is bypassable (incognito / another device / hitting the
// API directly), so it is a politeness limit, NOT security. Real protection is the
// server-verified hCaptcha above. The honeypot and Web3Forms' 250/month cap back it up.
const DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;
const STORE_KEY = "contact:sends";

declare global {
  interface Window {
    hcaptcha?: {
      render: (container: HTMLElement, params: Record<string, unknown>) => string;
      getResponse: (widgetId?: string) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId: string) => void;
    };
  }
}

function recentSendTimes(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    const times: number[] = raw ? JSON.parse(raw) : [];
    const cutoff = Date.now() - DAY_MS;
    return times.filter((t) => typeof t === "number" && t > cutoff);
  } catch {
    return [];
  }
}

function recordSend() {
  try {
    const next = recentSendTimes();
    next.push(Date.now());
    window.localStorage.setItem(STORE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage failures (private mode, disabled storage)
  }
}

function currentTheme(): "light" | "dark" {
  if (typeof document === "undefined") return "light";
  const root = document.documentElement;
  if (root.classList.contains("dark") || root.getAttribute("data-theme") === "dark") {
    return "dark";
  }
  return "light";
}

type Status = "idle" | "submitting" | "success";
type Notice = { msg: string; offerEmail: boolean } | null;

const FIELD =
  "w-full rounded-lg border border-support/40 bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted transition focus:border-display";
const LABEL =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<Notice>(null);
  const [apiReady, setApiReady] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);

  const formVisible = status !== "success";

  // Render the hCaptcha widget once the API is ready and the form is on screen. Keyed on
  // formVisible so it re-renders cleanly after "Send another" remounts the form, but is left
  // untouched across idle/submitting transitions so the solved token survives a submit.
  useEffect(() => {
    if (!apiReady || !formVisible) return;
    const el = containerRef.current;
    if (!el || !window.hcaptcha) return;
    const id = window.hcaptcha.render(el, {
      sitekey: HCAPTCHA_SITEKEY,
      theme: currentTheme(),
    });
    widgetIdRef.current = id;
    return () => {
      try {
        window.hcaptcha?.remove(id);
      } catch {
        // widget already gone
      }
      if (widgetIdRef.current === id) widgetIdRef.current = null;
    };
  }, [apiReady, formVisible]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // 1. Soft per-browser daily limit.
    if (recentSendTimes().length >= DAILY_LIMIT) {
      setNotice({
        msg: `You've hit the ${DAILY_LIMIT}-message daily limit.`,
        offerEmail: true,
      });
      return;
    }

    // 2. Captcha must be solved (also enforced server-side by Web3Forms).
    const token = window.hcaptcha?.getResponse(widgetIdRef.current ?? undefined) ?? "";
    if (!token) {
      setNotice({ msg: "Please complete the verification below before sending.", offerEmail: false });
      return;
    }

    setStatus("submitting");
    setNotice(null);

    const formData = new FormData(form); // includes the hidden h-captcha-response field
    formData.append("access_key", site.web3formsKey);
    formData.append("subject", "New message from your portfolio site");
    formData.append("from_name", "Portfolio Contact Form");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        recordSend();
        setStatus("success");
        form.reset();
      } else {
        setStatus("idle");
        setNotice({ msg: result.message || "Something went wrong.", offerEmail: true });
        if (window.hcaptcha && widgetIdRef.current) window.hcaptcha.reset(widgetIdRef.current);
      }
    } catch {
      setStatus("idle");
      setNotice({ msg: "Something went wrong.", offerEmail: true });
      if (window.hcaptcha && widgetIdRef.current) window.hcaptcha.reset(widgetIdRef.current);
    }
  }

  return (
    <section id="contact" className="bg-surface">
      <Script
        src="https://js.hcaptcha.com/1/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setApiReady(true)}
      />
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-10">
        <Reveal>
          <h2 className="font-display text-[clamp(34px,5vw,52px)] uppercase leading-none text-ink">
            Get in <span className="text-display">Touch</span>
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
            Have a role, a project, or just want to say hi? Drop a message and it
            lands straight in my inbox.
          </p>
        </Reveal>

        <Reveal delay={0.1}>
        {status === "success" ? (
          <div
            role="status"
            className="mt-8 max-w-2xl rounded-2xl border border-support/40 bg-bg p-8"
          >
            <p className="font-display text-2xl uppercase text-ink">
              Message sent <span className="text-display">✓</span>
            </p>
            <p className="mt-2 text-sm text-muted">
              Thanks for reaching out. I&apos;ll reply within 24h.
            </p>
            <button
              type="button"
              onClick={() => {
                setNotice(null);
                setStatus("idle");
              }}
              className="mt-4 text-[11px] font-bold uppercase tracking-[0.1em] text-display transition hover:opacity-80"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 max-w-2xl">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className={LABEL}>
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Your name"
                  className={FIELD}
                />
              </div>
              <div>
                <label htmlFor="email" className={LABEL}>
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  className={FIELD}
                />
              </div>
            </div>
            <div className="mt-5">
              <label htmlFor="message" className={LABEL}>
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="What's on your mind?"
                className={`${FIELD} resize-y`}
              />
            </div>

            {/* honeypot: hidden from humans, catches bots */}
            <input
              type="checkbox"
              name="botcheck"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
              style={{ display: "none" }}
            />

            {/* hCaptcha widget renders here (explicit render via the API) */}
            <div className="mt-5">
              <div ref={containerRef} className="h-captcha" />
              {!apiReady && (
                <p className="text-xs text-muted">Loading verification…</p>
              )}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting" || !apiReady}
                aria-busy={status === "submitting"}
                className="rounded-full bg-display px-6 py-3 text-[11px] font-bold uppercase tracking-[0.1em] text-bg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Sending..." : "Send Message"}
              </button>
              <p aria-live="polite" className="text-sm text-muted">
                {notice && (
                  <span>
                    {notice.msg}
                    {notice.offerEmail && (
                      <>
                        {" "}Email me at{" "}
                        <a
                          href={`mailto:${site.email}`}
                          className="font-semibold text-display underline"
                        >
                          {site.email}
                        </a>
                        .
                      </>
                    )}
                  </span>
                )}
              </p>
            </div>
          </form>
        )}
        </Reveal>
      </div>
    </section>
  );
}

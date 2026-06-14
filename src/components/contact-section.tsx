"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { Reveal } from "@/components/reveal";

// Per-browser courtesy throttle. Bypassable (incognito / another device), so it's a
// politeness limit, not hard security. Web3Forms' free honeypot and 250/month cap back it up.
const DAILY_LIMIT = 3;
const DAY_MS = 24 * 60 * 60 * 1000;
const STORE_KEY = "contact:sends";

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

type Status = "idle" | "submitting" | "success";
type Notice = { msg: string; offerEmail: boolean } | null;

const FIELD =
  "w-full rounded-lg border border-support/40 bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted transition focus:border-display";
const LABEL =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");
  const [notice, setNotice] = useState<Notice>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    // Soft per-browser daily limit.
    if (recentSendTimes().length >= DAILY_LIMIT) {
      setNotice({
        msg: `You've hit the ${DAILY_LIMIT}-message daily limit.`,
        offerEmail: true,
      });
      return;
    }

    setStatus("submitting");
    setNotice(null);

    const formData = new FormData(form);
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
      }
    } catch {
      setStatus("idle");
      setNotice({ msg: "Something went wrong.", offerEmail: true });
    }
  }

  return (
    <section id="contact" className="bg-surface">
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

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="submit"
                disabled={status === "submitting"}
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

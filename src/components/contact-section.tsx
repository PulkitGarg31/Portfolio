"use client";

import { useState } from "react";
import { site } from "@/config/site";
import { Reveal } from "@/components/reveal";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-lg border border-support/40 bg-bg px-4 py-3 text-sm text-ink placeholder:text-muted transition focus:border-display";
const LABEL =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-muted";

export function ContactSection() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("submitting");
    const payload = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: site.web3formsKey,
          subject: "New message from your portfolio site",
          from_name: "Portfolio Contact Form",
          ...payload,
        }),
      });
      const result = await res.json();
      if (result.success) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
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
              onClick={() => setStatus("idle")}
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
                {status === "error" && (
                  <span>
                    Something went wrong. Email me at{" "}
                    <a
                      href={`mailto:${site.email}`}
                      className="font-semibold text-display underline"
                    >
                      {site.email}
                    </a>
                    .
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

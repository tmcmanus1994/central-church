"use client";

import { TextArea, TextField } from "./Field";
import { useFormPost } from "@/lib/use-form-post";

const copy = {
  es: {
    firstField: "Nombre completo",
    email: "Correo electrónico",
    phone: "Teléfono",
    notes: "¿Algo que debamos saber?",
    submit: "Avísanos que vienes",
    submitting: "Enviando…",
    successTitle: "Te estaremos esperando",
    successBody:
      "Gracias por avisarnos — alguien de nuestro equipo se pondrá en contacto contigo antes del domingo.",
  },
  en: {
    firstField: "Full name",
    email: "Email",
    phone: "Phone",
    notes: "Anything we should know?",
    submit: "Let us know you're coming",
    submitting: "Sending…",
    successTitle: "We'll be looking for you",
    successBody:
      "Thanks for letting us know — someone from our team will be in touch before Sunday.",
  },
};

/**
 * "¡Déjanos saber que vienes!" — the Iglesia page's own contact form, always
 * routed to Matt Thomas (Outreach Minister, leads Spanish worship) via
 * /api/iglesia, regardless of which language toggle the visitor is on.
 */
export function IglesiaForm({ lang }: { lang?: "es" }) {
  const t = lang === "es" ? copy.es : copy.en;
  const { status, errorMessage, onSubmit } = useFormPost("/api/iglesia");

  if (status === "success") {
    return (
      <div className="flex flex-col items-start gap-3 rounded-[18px] bg-white p-8 lg:p-9">
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-accent-tint text-2xl">
          ✓
        </span>
        <h3 className="m-0 font-display text-[22px] tracking-[-.02em] text-ink">
          {t.successTitle}
        </h3>
        <p className="m-0 text-[15.5px] leading-[1.6] text-body">
          {t.successBody}
        </p>
      </div>
    );
  }

  return (
    <form
      className="grid grid-cols-1 gap-5 rounded-[18px] bg-white p-5 lg:p-9"
      action="/api/iglesia"
      method="post"
      onSubmit={onSubmit}
    >
      <TextField id="name" label={t.firstField} autoComplete="name" />
      <TextField id="email" label={t.email} type="email" autoComplete="email" />
      <TextField id="phone" label={t.phone} type="tel" optional autoComplete="tel" />
      <TextArea id="notes" label={t.notes} />
      {status === "error" && errorMessage ? (
        <p className="m-0 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[14.5px] text-red-700">
          {errorMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={status === "submitting"}
        className="flex h-14 items-center justify-center rounded-full bg-primary text-base font-bold text-white transition-colors hover:bg-primary-deep disabled:opacity-60"
      >
        {status === "submitting" ? t.submitting : t.submit}
      </button>
    </form>
  );
}

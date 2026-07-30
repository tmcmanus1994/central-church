"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Posts a <form>'s fields to a JSON API route and tracks the result inline.
 *
 * Without this, a plain `<form action="/api/...">` navigates the browser to
 * the route on submit and renders the raw `{"ok":true}` JSON as a page —
 * every one of the site's mailer forms (Kids Closet, Plan a Visit) posts to
 * one of these routes, so this is shared rather than duplicated per form.
 *
 * The form's `action`/`method` attributes stay in the markup as a no-JS
 * fallback — this only takes over once JavaScript actually runs.
 */
export function useFormPost(action: string) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    setErrorMessage(null);

    try {
      const res = await fetch(action, { method: "POST", body: new FormData(form) });
      const data: { ok?: boolean; error?: string } | null = await res
        .json()
        .catch(() => null);

      if (res.ok && data?.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
        setErrorMessage(data?.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setErrorMessage(
        "Something went wrong sending that. Please check your connection and try again.",
      );
    }
  }

  return { status, errorMessage, onSubmit };
}

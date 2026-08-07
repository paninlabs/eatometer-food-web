"use client";

import { FormEvent, useState } from "react";
import { useLanguage } from "@/components/use-language";
import { copy } from "@/lib/i18n";

type FormState = "idle" | "sending" | "sent" | "error";

export function SupportForm() {
  const { language } = useLanguage();
  const t = copy[language];
  const [state, setState] = useState<FormState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    setState("sending");

    try {
      const response = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          topic: formData.get("topic"),
          subject: formData.get("subject"),
          message: formData.get("message"),
          language,
        }),
      });

      if (response.ok) {
        form.reset();
        setState("sent");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  }

  return (
    <form className="support-form" onSubmit={handleSubmit}>
      <div className="form-grid-two">
        <label>
          <span>{t.formName}</span>
          <input name="name" autoComplete="name" maxLength={120} />
        </label>
        <label>
          <span>{t.formEmail}</span>
          <input name="email" type="email" autoComplete="email" maxLength={255} required />
        </label>
      </div>
      <label>
        <span>{t.formTopic}</span>
        <select name="topic" defaultValue="account">
          <option value="account">{t.formTopicAccount}</option>
          <option value="app">{t.formTopicApp}</option>
          <option value="ideas">{t.formTopicIdeas}</option>
          <option value="other">{t.formTopicOther}</option>
        </select>
      </label>
      <label>
        <span>{t.formSubject}</span>
        <input name="subject" maxLength={160} required />
      </label>
      <label>
        <span>{t.formMessage}</span>
        <textarea name="message" rows={7} maxLength={4000} required />
      </label>
      <button className="button button-primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? t.formSending : t.formSubmit}
      </button>
      <p className={`form-status form-status-${state}`} aria-live="polite">
        {state === "sent"
          ? t.formSent
          : state === "error"
            ? t.formError
            : ""}
      </p>
    </form>
  );
}
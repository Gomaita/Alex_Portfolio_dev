import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { createContactMessage } from "../../services/backend/contactMessagesService";
import { appConfig } from "../../config/appConfig";
import s from "./Organic.module.css";

export default function ContactForm() {
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  async function submit(event) {
    event.preventDefault();
    if (pending || !appConfig.isBackendEnabled) return;
    const form = event.currentTarget;
    const values = new FormData(form);
    setPending(true);
    setStatus("");
    try {
      const response = await createContactMessage({
        name: values.get("name"),
        email: values.get("email"),
        message: values.get("message"),
        honeypot: values.get("website"),
      });
      setStatus(
        response?.message ||
          "Message received. Thank you for getting in touch.",
      );
      form.reset();
    } catch (error) {
      setStatus(
        error.message ||
          "Your message could not be sent. Please try email instead.",
      );
    } finally {
      setPending(false);
    }
  }
  return (
    <form className={s.form} onSubmit={submit}>
      <h2>A note, an idea, a hello.</h2>
      {!appConfig.isBackendEnabled && (
        <p className={s.formNote}>
          Sending is unavailable in this local preview. You can reach me using
          the email link.
        </p>
      )}
      <div className={s.formPair}>
        <label>
          Your name
          <input
            name="name"
            autoComplete="name"
            required
            maxLength={100}
            placeholder="Alex"
          />
        </label>
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={200}
            placeholder="you@example.com"
          />
        </label>
      </div>
      <label>
        Your message
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={5000}
          rows={4}
          placeholder="Tell me a little about what you have in mind…"
        />
      </label>
      <label className={s.honeypot} aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <button
        className={s.button}
        disabled={pending || !appConfig.isBackendEnabled}
        type="submit"
      >
        {pending ? "Sending…" : "Send message"}
        <ArrowUpRight size={16} aria-hidden="true" />
      </button>
      <p role="status" aria-live="polite" className={s.formStatus}>
        {status}
      </p>
    </form>
  );
}

'use client';

import { useState } from 'react';

const TOPICS = [
  { value: 'listing', label: '🎉 List my business' },
  { value: 'feedback', label: '💬 Feedback or correction' },
  { value: 'other', label: '✉️ Something else' },
];

export default function ContactForm() {
  const [state, setState] = useState('idle'); // idle | sending | sent | error
  const [error, setError] = useState('');
  const [topic, setTopic] = useState('listing');

  async function handleSubmit(e) {
    e.preventDefault();
    setState('sending');
    setError('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || 'Something went wrong. Please try again.');
        setState('error');
        return;
      }
      setState('sent');
    } catch {
      setError('Network error. Please try again or email us directly.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div className="form-success">
        <h2>✅ Message sent!</h2>
        <p>
          Thanks for reaching out — we read every message and usually reply within a couple of
          days. If it&apos;s urgent, email{' '}
          <a href="mailto:feedback@torontobirthdayparties.com">feedback@torontobirthdayparties.com</a>{' '}
          directly.
        </p>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="field-row">
        <label>
          I want to…
          <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="field-row two-col">
        <label>
          Your name *
          <input type="text" name="name" required maxLength={100} placeholder="Jane Doe" />
        </label>
        <label>
          Your email *
          <input type="email" name="email" required maxLength={200} placeholder="jane@example.com" />
        </label>
      </div>

      {topic === 'listing' && (
        <div className="field-row two-col">
          <label>
            Business name *
            <input type="text" name="business" required={topic === 'listing'} maxLength={200} placeholder="Jump City Trampoline Park" />
          </label>
          <label>
            Website
            <input type="url" name="website" maxLength={300} placeholder="https://…" />
          </label>
        </div>
      )}

      <div className="field-row">
        <label>
          Message *
          <textarea
            name="message"
            required
            maxLength={4000}
            rows={topic === 'listing' ? 6 : 5}
            placeholder={
              topic === 'listing'
                ? 'Tell us about your venue: location, what your birthday party packages include, capacity, age range…'
                : 'What would you like to tell us?'
            }
          />
        </label>
      </div>

      {/* honeypot — invisible to humans, bots fill it and get silently dropped */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hp-field" aria-hidden="true" />

      {state === 'error' && <p className="form-error">{error}</p>}

      <button type="submit" className="cta form-submit" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send message →'}
      </button>
    </form>
  );
}

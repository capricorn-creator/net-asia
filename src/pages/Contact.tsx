import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePageMeta } from '../hooks/usePageMeta';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function ContactPage() {
  usePageMeta({
    title: 'Contact — NetAsia',
    description: 'Contact the NetAsia team with questions, bug reports, or tool suggestions.',
  });

  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: wire to a Cloudflare Worker or form endpoint
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Contact' }]} />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact</h1>
          <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>
            Have a question, found a bug, or want to suggest a tool? We'd like to hear from you.
          </p>

          {submitted ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Message received</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Thank you for reaching out. We aim to respond within two business days.</p>
              <button
                onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                className="btn-secondary mt-6 text-sm"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Name <span aria-hidden="true" style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field"
                    placeholder="Jane Smith"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                    Email <span aria-hidden="true" style={{ color: '#F87171' }}>*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Subject
                </label>
                <select
                  id="contact-subject"
                  value={form.subject}
                  onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                  className="input-field"
                >
                  <option value="">Select a topic…</option>
                  <option value="bug">Bug report</option>
                  <option value="feature">Tool suggestion</option>
                  <option value="data">Incorrect data / result</option>
                  <option value="general">General question</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
                  Message <span aria-hidden="true" style={{ color: '#F87171' }}>*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="input-field resize-none"
                  rows={5}
                  placeholder="Describe your question or feedback…"
                />
              </div>

              <button type="submit" className="btn-primary w-full justify-center" disabled={!form.name || !form.email || !form.message}>
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>

              <p className="text-xs text-center" style={{ color: 'var(--text-muted)' }}>
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-blue-400 hover:underline">Privacy Policy</a>.
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

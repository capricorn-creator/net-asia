import { useState } from 'react';
import { motion } from 'framer-motion';
import Breadcrumbs from '../components/ui/Breadcrumbs';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, wire to a Cloudflare Worker / form endpoint
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Breadcrumbs crumbs={[{ label: 'Contact' }]} />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="section-label">Get in Touch</div>
          <h1 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Contact Us</h1>
          <p className="mb-10" style={{ color: 'var(--text-secondary)' }}>
            Have a tool suggestion, found a bug, or want to say hi? We'd love to hear from you.
          </p>

          {submitted ? (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">✅</div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>Message sent!</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Thanks for reaching out. We'll get back to you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="btn-secondary mt-6 text-sm">Send another message</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Name</label>
                  <input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="input-field" placeholder="Jane Smith" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Email</label>
                  <input type="email" required value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="input-field" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Subject</label>
                <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input-field">
                  <option value="">Select a topic...</option>
                  <option value="bug">Bug Report</option>
                  <option value="feature">Tool Suggestion</option>
                  <option value="general">General Question</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>Message</label>
                <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  className="input-field resize-none" rows={5} placeholder="Tell us what's on your mind..." />
              </div>
              <button type="submit" className="btn-primary w-full justify-center">
                Send Message
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}

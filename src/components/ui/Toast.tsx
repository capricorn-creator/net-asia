import { AnimatePresence, motion } from 'framer-motion';
import type { ToastMessage } from '../../types';

interface Props {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  warning: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
    </svg>
  ),
};

const STYLES = {
  success: { icon: '#4ADE80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' },
  error: { icon: '#F87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' },
  warning: { icon: '#FBBF24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.2)' },
  info: { icon: '#60A5FA', bg: 'rgba(59,130,246,0.1)', border: 'rgba(59,130,246,0.2)' },
};

export default function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => {
          const s = STYLES[toast.type];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-xl max-w-xs"
              style={{
                background: 'var(--bg-card)',
                border: `1px solid ${s.border}`,
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center" style={{ background: s.bg, color: s.icon }}>
                {ICONS[toast.type]}
              </div>
              <p className="text-sm font-medium flex-1" style={{ color: 'var(--text-primary)' }}>{toast.message}</p>
              <button
                onClick={() => onRemove(toast.id)}
                className="flex-shrink-0 transition-opacity hover:opacity-60"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

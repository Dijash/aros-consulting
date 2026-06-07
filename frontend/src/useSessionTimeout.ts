import { useEffect, useRef } from 'react';
import toast from 'react-hot-toast';

const TIMEOUT_MS = 30 * 60 * 1000;
const WARN_MS = 60 * 1000;

export default function useSessionTimeout(
  isActive: boolean,
  isAdmin: boolean,
  onTimeout: () => void,
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnedRef = useRef(false);

  const clear = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (warnRef.current) clearTimeout(warnRef.current);
    warnedRef.current = false;
  };

  const reset = () => {
    if (!isActive || isAdmin) return;
    clear();

    warnRef.current = setTimeout(() => {
      if (warnedRef.current) return;
      warnedRef.current = true;
      toast('Session will expire in 1 minute due to inactivity', {
        icon: '⚠️',
        duration: 8000,
      });
    }, TIMEOUT_MS - WARN_MS);

    timerRef.current = setTimeout(() => {
      toast.error('Session expired due to inactivity');
      onTimeout();
    }, TIMEOUT_MS);
  };

  useEffect(() => {
    if (!isActive || isAdmin) {
      clear();
      return;
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    const handler = () => reset();
    events.forEach(ev => window.addEventListener(ev, handler));
    reset();

    return () => {
      clear();
      events.forEach(ev => window.removeEventListener(ev, handler));
    };
  }, [isActive, isAdmin, onTimeout]);
}

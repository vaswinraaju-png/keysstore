import { useState, useEffect } from 'react';

const SESSION_KEY = 'ks_timer_start';

export function useCountdown(durationSeconds = 900) {
  const getRemaining = () => {
    const start = parseInt(sessionStorage.getItem(SESSION_KEY) || '0');
    if (!start) {
      sessionStorage.setItem(SESSION_KEY, Date.now().toString());
      return durationSeconds;
    }
    const elapsed = Math.floor((Date.now() - start) / 1000);
    const remaining = durationSeconds - elapsed;
    if (remaining <= 0) {
      sessionStorage.setItem(SESSION_KEY, Date.now().toString());
      return durationSeconds;
    }
    return remaining;
  };

  const [seconds, setSeconds] = useState(getRemaining);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          sessionStorage.setItem(SESSION_KEY, Date.now().toString());
          return durationSeconds;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [durationSeconds]);

  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return { display: `${m}:${s}`, seconds };
}

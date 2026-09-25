import { useEffect, useRef } from 'react';
import { APP_CONFIG } from '@/config/app.config';

const ACTIVITY_EVENTS = ['mousedown', 'keydown', 'touchstart', 'scroll'] as const;

/** G18: signs the user out after a period of inactivity, configurable via APP_CONFIG.idleTimeoutMinutes. */
export function useIdleLogout(onIdle: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const timeoutMs = APP_CONFIG.idleTimeoutMinutes * 60 * 1000;

    function resetTimer() {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(onIdle, timeoutMs);
    }

    resetTimer();
    ACTIVITY_EVENTS.forEach((event) => window.addEventListener(event, resetTimer));

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      ACTIVITY_EVENTS.forEach((event) => window.removeEventListener(event, resetTimer));
    };
  }, [onIdle]);
}

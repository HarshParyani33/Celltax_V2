/**
 * Reusable timer tracker for intervals and timeouts.
 * Facilitates safe, automatic cleanup on component unmount or state transitions.
 */
export interface TimerTracker {
  addTimeout: (fn: () => void, delayMs: number) => ReturnType<typeof setTimeout>;
  setInterval: (fn: () => void, delayMs: number) => ReturnType<typeof setInterval>;
  clearAll: () => void;
  getActiveTimeoutCount: () => number;
  hasActiveInterval: () => boolean;
}

export function createTimerTracker(): TimerTracker {
  let activeInterval: ReturnType<typeof setInterval> | null = null;
  let activeTimeouts: ReturnType<typeof setTimeout>[] = [];

  return {
    addTimeout(fn: () => void, delayMs: number): ReturnType<typeof setTimeout> {
      const id = setTimeout(() => {
        activeTimeouts = activeTimeouts.filter((t) => t !== id);
        fn();
      }, delayMs);
      activeTimeouts.push(id);
      return id;
    },
    setInterval(fn: () => void, delayMs: number): ReturnType<typeof setInterval> {
      if (activeInterval) {
        clearInterval(activeInterval);
      }
      activeInterval = setInterval(fn, delayMs);
      return activeInterval;
    },
    clearAll(): void {
      if (activeInterval) {
        clearInterval(activeInterval);
        activeInterval = null;
      }
      activeTimeouts.forEach(clearTimeout);
      activeTimeouts = [];
    },
    getActiveTimeoutCount(): number {
      return activeTimeouts.length;
    },
    hasActiveInterval(): boolean {
      return activeInterval !== null;
    },
  };
}

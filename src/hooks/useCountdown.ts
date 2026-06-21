import { useEffect, useState } from "react";

export function useCountdown(startTime: number, totalSeconds: number, isRunning = true): number {
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);

  useEffect(() => {
    if (!isRunning) {
      setSecondsLeft(totalSeconds);
      return;
    }

    const timer = window.setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      setSecondsLeft(Math.max(0, totalSeconds - elapsedSeconds));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [isRunning, startTime, totalSeconds]);

  return secondsLeft;
}

import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: string;
  compact?: boolean;
  categoryColor?: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const CountdownTimer = ({ targetDate, compact = false, categoryColor }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();
      
      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    };

    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <div className="text-emerald-400 font-bold font-mono text-sm uppercase tracking-wide">
        Event Started
      </div>
    );
  }

  if (!timeLeft) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-1 text-xs font-mono text-slate-300">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
      </div>
    );
  }

  return (
    <div className="flex gap-6 items-center">
      <div className="text-center">
        <div className={`text-5xl md:text-6xl font-bold font-mono tabular-nums ${categoryColor ? `bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent` : 'text-white'} drop-shadow-lg`}>
          {timeLeft.days.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-white/70 uppercase mt-2 tracking-wide font-semibold">Days</div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white/30">:</div>
      <div className="text-center">
        <div className={`text-5xl md:text-6xl font-bold font-mono tabular-nums ${categoryColor ? `bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent` : 'text-white'} drop-shadow-lg`}>
          {timeLeft.hours.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-white/70 uppercase mt-2 tracking-wide font-semibold">Hours</div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white/30">:</div>
      <div className="text-center">
        <div className={`text-5xl md:text-6xl font-bold font-mono tabular-nums ${categoryColor ? `bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent` : 'text-white'} drop-shadow-lg`}>
          {timeLeft.minutes.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-white/70 uppercase mt-2 tracking-wide font-semibold">Minutes</div>
      </div>
      <div className="text-4xl md:text-5xl font-bold text-white/30">:</div>
      <div className="text-center">
        <div className={`text-5xl md:text-6xl font-bold font-mono tabular-nums ${categoryColor ? `bg-gradient-to-r ${categoryColor} bg-clip-text text-transparent` : 'text-white'} drop-shadow-lg`}>
          {timeLeft.seconds.toString().padStart(2, '0')}
        </div>
        <div className="text-xs text-white/70 uppercase mt-2 tracking-wide font-semibold">Seconds</div>
      </div>
    </div>
  );
};

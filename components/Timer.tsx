
import React, { useState, useEffect, useRef } from 'react';

interface TimerProps {
  durationInSeconds: number;
  onTimeUp: () => void;
}

const Timer: React.FC<TimerProps> = ({ durationInSeconds, onTimeUp }) => {
  const [timeLeft, setTimeLeft] = useState(durationInSeconds);
  const onTimeUpRef = useRef(onTimeUp);
  onTimeUpRef.current = onTimeUp;

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUpRef.current();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  
  const timeColor = timeLeft < 300 ? 'text-red-500' : 'text-gray-800 dark:text-white';

  return (
    <div className={`text-2xl font-bold p-2 rounded-lg bg-gray-200 dark:bg-gray-700 ${timeColor}`}>
      <span>{String(minutes).padStart(2, '0')}</span>:<span>{String(seconds).padStart(2, '0')}</span>
    </div>
  );
};

export default Timer;

'use client';
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import styles from './Timer.module.css';

const Timer = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(25 * 60);
  };

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`${styles.timerContainer} glass`}>
      <h3 className={styles.title}>Focus Timer</h3>
      <div className={styles.display}>{formatTime(seconds)}</div>
      <div className={styles.controls}>
        <button onClick={toggleTimer} className={styles.btn}>
          {isActive ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button onClick={resetTimer} className={styles.btn}>
          <RotateCcw size={24} />
        </button>
      </div>
    </div>
  );
};

export default Timer;

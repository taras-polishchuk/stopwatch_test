import logo from './logo.svg';
import './App.css';
import { useState, useEffect, useCallback } from 'react';
import { bind } from "@react-rxjs/core"
import { createSignal } from "@react-rxjs/utils"

const [timeChangeRx$, setTimeRx] = createSignal();

const [useTimeRx, timeRx$] = bind(timeChangeRx$, 0);

const addZero = (digit) => {
  return `${digit}`.length === 1 ? `0${digit}` : digit;
}

const getParsedTime = (seconds) => {
  const ss = addZero(seconds % 60);
  const mm = addZero(parseInt(seconds / 60) % 60);
  const hh = addZero(parseInt( seconds / 3600));

  return `${hh}:${mm}:${ss}`;
}

const App = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [waitTimer, setWaitTimer] = useState(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (isRunning) {
        setTime(time + 1);
        setTimeRx(time + 1);
     }
    }, 1000);

    return () => {
      clearTimeout(timeout);
    }
  }, [time, isRunning]);

  const start = useCallback(() => {
    setIsRunning(true);
    setWaitTimer(null);
  }, [isRunning]);

  const stop = useCallback(() => {
    setIsRunning(false);
    setWaitTimer(null);
    setTime(0);
    setTimeRx(0);
  }, [isRunning]);

  const wait = useCallback(() => {
    const currentTime = new Date().getTime();
    if (!waitTimer) {
      setWaitTimer(currentTime);
      setTimeout( () => {
        setWaitTimer(null);
      }, 330);
    } else if (currentTime - waitTimer < 300) {
      setIsRunning(false);
      setWaitTimer(null);
    } else {
      setWaitTimer(null);
    }
  }, [isRunning, waitTimer]);

  const reset = useCallback(() => {
    setTime(0);
    setTimeRx(0);
  }, [isRunning]);

  const parsedTime = getParsedTime(time);

  const rxTime = useTimeRx();
  const parsedRxTime = getParsedTime(rxTime);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <section className="section">
        <div className="time">
          react {parsedTime}
        </div>
        <div className="time">
          rxjs {parsedRxTime}
        </div>
        <div className="controls">
          {!isRunning ? (
              <button className="btn" onClick={start}>start</button>
          ) : (
            <button className="btn" onClick={stop}>stop</button>
          )}
          <button className="btn" onClick={wait} disabled={!isRunning}>wait</button>
          <button className="btn" onClick={reset}>reset</button>
        </div>
      </section>
    </div>
  );
}

export default App;

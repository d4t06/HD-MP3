import { useRef, useState, useEffect } from "react";
import appConfig from "../config/app";

export default function useDebounce(cb: () => void, delay: number) {
  const timerId = useRef<NodeJS.Timeout>();

  const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
  const [someThingToRun, setSomeThingToRun] = useState(0);

  // prevent multiple click and run restore vb
  useEffect(() => {
    if (!someThingToTrigger) return;

    timerId.current = setTimeout(() => (timerId.current = undefined), delay);
  }, [someThingToRun, appConfig]);

  // run cb,trigger prevent multiple click
  useEffect(() => {
    if (!timerId.current) {
      cb();
      setSomeThingToRun(Math.random() * 10);
    }
  }, [someThingToTrigger]);

  // trigger cb
  return () => setSomeThingToTrigger(Math.random() * 10);
}

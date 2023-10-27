import { useRef, useState, useEffect } from "react";


export default function useDebounce(cb: () => void, delay: number) {
  const timerId = useRef<NodeJS.Timeout>();
  const [someThingToTrigger, setSomeThingToTrigger] = useState(0);

  useEffect(() => {
    timerId.current = setTimeout(() => cb(), delay);

    return () => clearTimeout(timerId.current);
  }, [delay, someThingToTrigger]);

  return () => setSomeThingToTrigger(Math.random());
}

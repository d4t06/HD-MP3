import { useEffect, useRef, useState } from "react";
import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";

export default function usePersistState<T>(
  key: string,
  init: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(init);

  const isGetStorage = useRef(false);

  useEffect(() => {
    const storedState = (getLocalStorage()[key] as T) || init;
    setValue(storedState);
  }, []);

  useEffect(() => {
    if (!isGetStorage.current) {
      isGetStorage.current = true;
      return;
    }

    setLocalStorage(key, value);
  }, [value]);

  return [value, setValue];
}

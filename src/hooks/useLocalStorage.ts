import { useEffect, useState } from "react";

const useLocalStorage = <T>(
   key: string,
   initValue: T
): [T, React.Dispatch<React.SetStateAction<T>>] => {
   const [value, setValue] = useState<T>(() => {
      const storage = JSON.parse(localStorage.getItem("HD-MP3") || "{}");

      return storage[key] || initValue;
   });

   useEffect(() => {
      const storage = JSON.parse(localStorage.getItem("HD-MP3") || "{}");

      storage[key] = value;
      localStorage.setItem("HD-MP3", JSON.stringify(storage));
   }, [value]);

   return [value, setValue];
};

export default useLocalStorage;

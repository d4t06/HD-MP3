import { useEffect, useState } from "react"

const useLocalStorage = <T>(key: string, initValue: T):  [T, React.Dispatch<React.SetStateAction<T>>] => {


   const [value, setValue] = useState<T>(JSON.parse(localStorage.getItem(key) || JSON.stringify(initValue)));

   useEffect(() => {
      // console.log("check value use local storage", value);
      

      localStorage.setItem(key, JSON.stringify(value))
   }, [value])


   return [value, setValue]
}


export default useLocalStorage
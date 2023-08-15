import { useEffect, useState } from "react"

const useLocalStorage = <T>(key: string, initValue: T):  [T, React.Dispatch<React.SetStateAction<T>>] => {


   const [value, setValue] = useState<T>(JSON.parse(localStorage.getItem(key) || JSON.stringify(initValue)));

   useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value))
   }, [value])


   return [value, setValue]
}


export default useLocalStorage
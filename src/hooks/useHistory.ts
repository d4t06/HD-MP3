import { useEffect, useState } from "react"
import { useAuthStore } from "../store"

function useHistory() {
   const {userInfo} = useAuthStore()
   const [history, setHistoty] = useState<string[]>([])


   useEffect(() => {
      if (!userInfo.email) return;

      
   }, [userInfo])

}

export default useHistory
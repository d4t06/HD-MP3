import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { User } from "../types";

export function useUserState() {
   const [loggedInUser] = useAuthState(auth)
   const [userData, setUserData] = useState<User>()


   useEffect(() => {
      console.log("useEffect in useUserState");
      const getUser = async () => {
         const userDocRef = doc(db, 'users', loggedInUser?.email as string);
         const userSnapShot = await getDoc(userDocRef);

         const userData = userSnapShot.data() as User;

         setUserData(userData)
      }

      getUser();
   }, [])


   return { userData }
}

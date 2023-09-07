import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import { ReactNode, useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Auth({ children }: { children: ReactNode }) {
   const [loggedInUser, loading] = useAuthState(auth);

   // Because need to fetch data user in other page
   // so we need to pause all processes until user data updated
   const [updatingUser, setUpdatingUser] = useState(false)

   useEffect(() => {
      // console.log("useEffect in Auth");

      
      
      const storageUser = async () => {
         try {
            await setDoc(
               doc(db, "users", loggedInUser?.email as string),
               {
                  email: loggedInUser?.email,
                  lassSeen: serverTimestamp(),
                  photoURL: loggedInUser?.photoURL,
               },
               {
                  merge: true,
               }
            );

            setUpdatingUser(false)
         } catch (error) {}
      };

      // if (loggedInUser) storageUser();

      // console.log("check loggedInUser", loggedInUser);
      
   }, [loading])

   
   if (loading || updatingUser) return <h1>Loading...</h1>;
   else return children
}

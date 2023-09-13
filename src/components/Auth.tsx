import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { ReactNode, useEffect, useRef, useState } from "react";
// import { doc, serverTimestamp, setDoc } from "firebase/firestore";

export default function Auth({ children }: { children: ReactNode }) {
   const [loggedInUser, loading] = useAuthState(auth);

   // Because need to fetch data user in other page
   // so we need to pause all processes until user data updated
   const [updatingUser, _setUpdatingUser] = useState(false);
   const isUpdateDone = useRef(true)

   useEffect(() => {
      // console.log("useEffect in Auth");

      // const storageUser = async () => {
      //    console.log("update done", isUpdateDone.current);

      //    try {
      //       await setDoc(
      //          doc(db, "users", loggedInUser?.email as string),
      //          {
      //             email: loggedInUser?.email,
      //             latest_seen: serverTimestamp(),
      //             photoURL: loggedInUser?.photoURL,
      //          },
      //          {
      //             merge: true,
      //          }
      //       );

      //       setUpdatingUser(false);
      //       isUpdateDone.current = true;


      //    } catch (error) {}
      // };

      // if has loggedInUser and no update done
      if (loggedInUser && !isUpdateDone.current) {
         // storageUser();
      }

   }, [loggedInUser]);


   console.log('check loading', loading);
   
   if (loading || updatingUser) return <h1>Loading...</h1>;
   
   else return children;   
}

import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { ReactNode, useEffect } from "react";
import { serverTimestamp } from "firebase/firestore";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useAuthStore } from "../store/AuthContext";

export default function Auth({ children }: { children: ReactNode }) {
   const [loggedInUser, loading] = useAuthState(auth);
   const { setUserInfo, userInfo } = useAuthStore();

   // Because need to fetch data user in other page
   // so we need to pause all processes until user data updated
   useEffect(() => {
      const handleUserLogged = async () => {
         try {
            await mySetDoc({
               collection: "users",
               data: {
                  email: loggedInUser?.email,
                  latest_seen: serverTimestamp(),
                  photoURL: loggedInUser?.photoURL,
               },
               id: loggedInUser?.email as string,
            });

            setUserInfo({
               status: "finish",
               email: loggedInUser?.email as string,
               display_name: loggedInUser?.displayName as string,
               photoURL: loggedInUser?.photoURL as string,
            });

            // await new Promise<void>((rs) => [
            //    setTimeout(() => {
            //       setUserInfo({
            //          status: "finish",
            //          email: loggedInUser?.email as string,
            //          display_name: loggedInUser?.displayName as string,
            //          photoURL: loggedInUser?.photoURL as string,
            //       });

            //       rs();
            //       console.log("update user finish");
            //    }, 2000),
            // ]);
         } catch (error) {
            console.log(error);
         }
      };

      if (loading) return;

      if (!loggedInUser) {
         console.log("auth no user");

         if (userInfo.status !== "finish") {
            setUserInfo({
               status: "finish",
            });
         }
         return;
      }

      handleUserLogged();

      // loading for login
      // loggedInUser for logout
   }, [loggedInUser, loading]);

   return children;
}

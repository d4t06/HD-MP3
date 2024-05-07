import { Outlet } from "react-router-dom";
import { useAuthStore } from "../store";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { auth } from "../config/firebase";
import { myGetDoc } from "../utils/firebaseHelpers";
import { sleep } from "../utils/appHelpers";

export default function PersistLogin() {
   const { setUser } = useAuthStore();
   const [loggedInUser, authStateLoading] = useAuthState(auth);

   useEffect(() => {
      if (authStateLoading) return;

      const auth = async () => {
         try {
            if (!loggedInUser || !loggedInUser.email) {
               if (import.meta.env.DEV) await sleep(500);

               return setUser({ type: "set-user", user: null });
            }

            const userSnapshot = await myGetDoc({
               collection: "users",
               id: loggedInUser.email,
               msg: ">>> api: get auth info",
            });

            const userDoc = userSnapshot.data() as User;

            Object.assign(userDoc, {
               email: loggedInUser.email as string,
               display_name: loggedInUser.displayName as string,
               photoURL: loggedInUser.photoURL as string,
               like_song_ids: userDoc.like_song_ids || [],
               playlist_ids: userDoc.playlist_ids || [],
               play_history: userDoc.play_history || [],
            } as Partial<User>);

            setUser({ type: "set-user", user: userDoc });
         } catch (error) {
            console.log({ message: error });
         }
      };

      auth();
   }, [authStateLoading, loggedInUser]);

   return <Outlet />;
}

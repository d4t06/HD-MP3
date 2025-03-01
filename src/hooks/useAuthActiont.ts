import { auth, provider } from "@/firebase";
import { useAuthContext } from "@/stores";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";

export default function useAuthAction() {
  const { user } = useAuthContext();
  const [isFetching, setIsFetching] = useState(false);

  const action = async (type: "login" | "logout") => {
    try {
      setIsFetching(true);

      switch (type) {
        case "login": {
          await signInWithPopup(auth, provider);

          break;
        }
        case "logout": {
          await signOut(auth);

          break;
        }
        //   case "register": {
        //     setIsFetching(true);

        //     justRegistered.current = true;
        //     await createUserWithEmailAndPassword(auth, props.email, props.password);

        //     break;
        //   }
      }

      setIsFetching(false);
    } catch (error) {
      throw error;
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action, user };
}

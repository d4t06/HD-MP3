import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase";
import { ReactNode, useEffect, useRef } from "react";
import { serverTimestamp } from "firebase/firestore";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useAuthStore } from "../store/AuthContext";
import { request } from "../utils/appHelpers";

export default function Auth({ children }: { children: ReactNode }) {
  const [loggedInUser, loading] = useAuthState(auth);
  const { setUserInfo, userInfo } = useAuthStore();
  const ranFetchToServer = useRef(false);

  const fetchToServer = async () => {
    ranFetchToServer.current = true;
    try {
      await request.get("");
    } catch (error: any) {
      if (error.response) console.log(">>> server is running");
      else console.log(">>> server is offline");
    }
  };

  const handleUserLogged = async () => {
    try {
      if (!loggedInUser?.email) {
        setUserInfo({
          status: "finish",
        });
        return;
      }

      // await mySetDoc({
      //   collection: "users",
      //   data: {
      //     email: loggedInUser?.email,
      //     latest_seen: serverTimestamp(),
      //     photoURL: loggedInUser?.photoURL || "",
      //     display_name: loggedInUser?.displayName || "",
      //   },
      //   id: loggedInUser?.email as string,
      // });

      setUserInfo({
        status: "finish",
        email: loggedInUser?.email as string,
        display_name: loggedInUser?.displayName as string,
        photoURL: loggedInUser?.photoURL as string,
      });
      console.log(">>> auth have user, update status");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loading) return;

    if (!loggedInUser) {
      if (userInfo.status !== "finish") {
        setUserInfo({
          status: "finish",
        });
        console.log(">>> auth no user, set userinfo status");
      }
      return;
    }

    if (!ranFetchToServer.current) {
      fetchToServer();
    }

    handleUserLogged();

    // loading for login
    // loggedInUser for logout
  }, [loggedInUser, loading]);

  return children;
}

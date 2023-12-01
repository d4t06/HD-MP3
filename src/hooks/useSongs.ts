import { useEffect, useRef, useState } from "react";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { useAuthStore } from "../store/AuthContext";
import { sleep } from "../utils/appHelpers";
import { useLocation } from "react-router-dom";
import appConfig from "../config/app";
import { testPlaylists, testSongs } from "./songs";
import * as appServices from "../services/appServices";
import { useLocalStorage } from ".";
// import { mySetDoc } from "../utils/firebaseHelpers";

export default function useSong({ admin }: { admin?: boolean }) {
  const { setErrorToast } = useToast();
  const { userInfo, setUserInfo } = useAuthStore();
  const { initial, initSongsContext } = useSongsStore();

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const hasRanInitFinish = useRef(true);
  const location = useLocation();

  const [_playHistory, setPlayHistory] = useLocalStorage<string[]>(
    "play_history",
    []
  );

  const handleErrorMsg = (msg: string) => {
    setLoading(false);
    setErrorMsg(msg);
    setErrorToast({ message: "Use song error" });
  };

  const initSongsAndPlaylists = async () => {
    if (appConfig.isDebug) {
      await sleep(appConfig.loadingDuration);
      initSongsContext({
        userSongs: testSongs,
        userPlaylists: testPlaylists,
        adminPlaylists: testPlaylists,
        adminSongs: testSongs,
      });

      setLoading(false);

      return;
    }

    try {
      setLoading(true);
      const adminSongs = await appServices.getAdminSongs();
      const adminPlaylists = await appServices.getAdminPLaylist();

      // case no logged in
      if (!userInfo.email || admin) {
        await sleep(appConfig.loadingDuration);
        initSongsContext({ adminSongs, adminPlaylists });
        setLoading(false);
        return;
      }

      const fullUserInfo = await appServices.getUserInfo(
        userInfo.email as string
      );

      // case new user
      if (!fullUserInfo?.email) {
        //  await mySetDoc({
        //    collection: "users",
        //    data: {
        //       email: loggedInUser?.email,
        //       latest_seen: serverTimestamp(),
        //       photoURL: loggedInUser?.photoURL,
        //    },
        //    id: loggedInUser?.email as string,
        // });
        return;
      }

      setUserInfo({ ...fullUserInfo });
      console.log('use song set full user info');
      

      if (fullUserInfo.play_history) {
        setPlayHistory(fullUserInfo.play_history);
      }

      const userData = await appServices.getUserSongsAndPlaylists(fullUserInfo);
      initSongsContext({ ...userData, adminSongs, adminPlaylists });
    } catch (error) {
      console.log(error);
      handleErrorMsg("init song error");
    } finally {
      setLoading(false);
      hasRanInitFinish.current = true;
    }
  };

  // run initSongsAndPlaylists
  useEffect(() => {
    if (admin) {
      if (initial) {
        setTimeout(() => setLoading(false), appConfig.loadingDuration);
      }
      return;
    }
    // setLoading(true);

    if (userInfo.status === "loading") {
      return;
    }

    if (location.pathname === "/mysongs" && !userInfo.email) {
      console.log(">>> skip init because in /mysongs but no user");
      // setLoading(true);
      return;
    }

    if (!initial && hasRanInitFinish.current) {
      hasRanInitFinish.current = false;
      initSongsAndPlaylists();

      return;
    } else if (initial) {
      console.log("Already init");

      setTimeout(() => setLoading(false), appConfig.loadingDuration);
      return;
    }
  }, [userInfo.status, initial]);
  // user loading x1
  // loading x2
  // 3 time re-render

  return {
    initial,
    loading,
    errorMsg,
    initSongsAndPlaylists,
  };
}

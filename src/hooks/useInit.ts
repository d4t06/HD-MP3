import { useEffect, useState } from "react";
import { useSongsStore } from "../store/SongsContext";
import { useToast } from "../store/ToastContext";
import { useAuthStore } from "../store/AuthContext";
import { sleep } from "../utils/appHelpers";
// import { useLocation } from "react-router-dom";
import appConfig from "../config/app";
import { testPlaylists, testSongs } from "./songs";
import * as appServices from "../services/appServices";
// import { useLocalStorage } from ".";
// import { mySetDoc } from "../utils/firebaseHelpers";

export default function useInitSong({ admin }: { admin?: boolean }) {
   const { setErrorToast } = useToast();
   const { user, loading: userLoading } = useAuthStore();
   const { initial, initSongsContext } = useSongsStore();

   const [errorMsg, setErrorMsg] = useState<string>("");
   const [loading, setLoading] = useState(true);

   // const ranInit = useRef(false);
   // const location = useLocation();

   // const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);

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
         const adminSongs = await appServices.getAdminSongs();
         const adminPlaylists = await appServices.getAdminPLaylist();

         // case no logged in
         if (!user || admin) {
            await sleep(appConfig.loadingDuration);
            initSongsContext({ adminSongs, adminPlaylists });
         } else {
            const userSongsAndPlaylist = await appServices.getUserSongsAndPlaylists(user);
            initSongsContext({ ...userSongsAndPlaylist, adminSongs, adminPlaylists });
         }

         // if (fullUserInfo.play_history) {
         //   setPlayHistory(fullUserInfo.play_history);
         // }
      } catch (error) {
         console.log({ message: error });
         handleErrorMsg("init song error");
      } finally {
         setLoading(false);
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

      if (userLoading) return setLoading(true);

      // if (location.pathname === "/mysongs" && !user.email) {
      //    console.log(">>> skip init because in /mysongs but no user");
      //    return;
      // }

      if (!initial) {
         // ranInit.current = true;
         initSongsAndPlaylists();

         return;
      } else {
         console.log("Already init");
         setTimeout(() => setLoading(false), appConfig.loadingDuration);
         return;
      }
   }, [userLoading]);
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

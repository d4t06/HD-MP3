import { useEffect, useState } from "react";
import { useSongsStore } from "@/store/SongsContext";
import { useToast } from "../store/ToastContext";
import { useAuthStore } from "@/store/AuthContext";
import { sleep } from "../utils/appHelpers";
import appConfig from "../config/app";
import * as appService from "../services/appService";
import { devSongs } from "@/constants/songs";
import { devPlaylists } from "@/constants/playlist";

export default function useInitSong({ admin }: { admin?: boolean }) {
  const { setErrorToast } = useToast();
  const { user, loading: userLoading } = useAuthStore();
  const { initial, initSongsContext } = useSongsStore();

  const [errorMsg, setErrorMsg] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // const [_playHistory, setPlayHistory] = useLocalStorage<string[]>("play_history", []);

  const handleErrorMsg = (msg: string) => {
    setLoading(false);
    setErrorMsg(msg);
    setErrorToast("Use song error");
  };

  const initSongsAndPlaylists = async () => {
    try {
      if (appConfig.isDev) {
        await sleep(appConfig.loadingDuration);
        initSongsContext({ adminSongs: devSongs, adminPlaylists: devPlaylists });

        return;
      }

      const adminSongs = await appService.getAdminSongs();
      const adminPlaylists = await appService.getAdminPLaylist();


      console.log(adminSongs);
      console.log(adminPlaylists);
      

      // console.log("check admin songs", adminSongs);
      // console.log("check admin playlists", adminPlaylists);

      if (admin) {
        initSongsContext({ userSongs: adminSongs, userPlaylists: adminPlaylists });

        // console.log("admin", adminPlaylists, adminSongs);

        setLoading(false);
        return;
      }

      // case no logged in
      if (!user) {
        await sleep(appConfig.loadingDuration);
        initSongsContext({ adminSongs, adminPlaylists });
      } else {
        const userSongsAndPlaylist = await appService.getUserSongsAndPlaylists(user);

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
    if (userLoading) return setLoading(true);

    if (!initial) {
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

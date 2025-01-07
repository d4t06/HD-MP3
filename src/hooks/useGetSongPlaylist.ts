import appConfig from "@/config/app";
import { devPlaylists } from "@/constants/playlist";
import { devSongs } from "@/constants/songs";
import { useAuthStore } from "@/store";
import { useSongContext } from "@/store/SongsContext";
import { sleep } from "@/utils/appHelpers";
import { useEffect, useState } from "react";
import * as appService from "../services/appService";

type Props = {
  variant: "home" | "user" | "dashboard";
};

export default function useGetSongPlaylist({ variant }: Props) {
  const { setSysSongPlaylist, setSongs, setPlaylists, ranGetSong } = useSongContext();
  const { user, loading: userLoading } = useAuthStore();

  const [isFetching, setIsFetching] = useState(true);

  const start = async () => {
    try {
      if (appConfig.isDev) {
        await sleep(appConfig.loadingDuration);
        setSysSongPlaylist({ playlists: devPlaylists, songs: devSongs });

        return;
      }

      switch (variant) {
        case "home":
          const sysSongs = await appService.getSongs({
            variant: "home",
          });
          const sysPlaylists = await appService.getPlaylists({ variant: "admin" });

          setSysSongPlaylist({ playlists: sysPlaylists || [], songs: sysSongs || [] });

          break;
        case "user":
          if (!user) return;

          if (ranGetSong.current) {
            await sleep(500);
            break;
          }

          ranGetSong.current = true;
          console.log("get");

          const { userPlaylists, userSongs } =
            await appService.getUserSongsAndPlaylists(user);

          setSongs(userSongs);
          setPlaylists(userPlaylists);

          break;

        case "dashboard": {
          const sysSongs = await appService.getSongs({
            variant: "dashboard",
          });
          const sysPlaylists = await appService.getPlaylists({ variant: "admin" });

          setSongs(sysSongs || []);
          setPlaylists(sysPlaylists || []);

          // setSysSongPlaylist({ playlists: sysPlaylists || [], songs: sysSongs || [] });

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  // run initSongsAndPlaylists
  useEffect(() => {
    if (userLoading) return setIsFetching(true);

    start();
  }, [userLoading]);

  return { isFetching };
}

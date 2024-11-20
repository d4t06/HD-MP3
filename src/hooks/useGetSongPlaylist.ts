import appConfig from "@/config/app";
import { devPlaylists } from "@/constants/playlist";
import { devSongs } from "@/constants/songs";
import { useAuthStore } from "@/store";
import { useSongContext } from "@/store/SongsContext";
import { sleep } from "@/utils/appHelpers";
import { useEffect, useState } from "react";
import * as appService from "../services/appService";

type Props = {
  variant: "sys" | "mysong" | "dashboard";
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
        case "sys":
          const sysSongs = await appService.getAdminSongs();
          const sysPlaylists = await appService.getAdminPlaylist();

          setSysSongPlaylist({ playlists: sysPlaylists || [], songs: sysSongs || [] });

          break;
        case "mysong":
          if (!user) return;

          if (ranGetSong.current) {
            await sleep(500);
            break;
          }

          ranGetSong.current = true;
          console.log("get");

          const { userPlaylists, userSongs } = await appService.getUserSongsAndPlaylists(
            user
          );

          setSongs(userSongs);
          setPlaylists(userPlaylists);
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

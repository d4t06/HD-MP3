import appConfig from "@/config/app";
import { devPlaylists } from "@/constants/playlist";
import { devSongs } from "@/constants/songs";
import { useSongContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { useState } from "react";
import * as appService from "../services/appService";

export default function useGetSongPlaylist() {
  const { setSysSongPlaylist, setSongs, setPlaylists } = useSongContext();

  const [isFetching, setIsFetching] = useState(true);

  type GetUserSongAndPlaylistProps = {
    variant: "user";
    email: string;
  };

  type GetSongAndPlaylistProps = {
    variant: "home" | "dashboard";
  };

  const getSongAndPlaylist = async (
    props: GetSongAndPlaylistProps | GetUserSongAndPlaylistProps
  ) => {
    try {
      if (appConfig.isDev) {
        await sleep(appConfig.loadingDuration);
        setSysSongPlaylist({ playlists: devPlaylists, songs: devSongs });

        return;
      }

      switch (props.variant) {
        case "home":
          const sysSongs = await appService.getSongs({
            variant: "home",
          });
          const sysPlaylists = await appService.getPlaylists({ variant: "admin" });

          setSysSongPlaylist({ playlists: sysPlaylists || [], songs: sysSongs || [] });

          break;
        case "user":
          // if (ranGetSong.current) {
          //   await sleep(500);
          //   break;
          // }

          // ranGetSong.current = true;
          // console.log("get");

          const { userPlaylists, userSongs } = await appService.getUserSongsAndPlaylists(
            props.email
          );

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

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, getSongAndPlaylist };
}

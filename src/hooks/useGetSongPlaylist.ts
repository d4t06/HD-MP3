import appConfig from "@/config/app";
import { devPlaylists } from "@/constants/playlist";
import { devSongs } from "@/constants/songs";
import { useSongContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { useState } from "react";
import * as appService from "../services/appService";

export default function useGetSongPlaylist() {
  const { setSysSongPlaylist, playlists, sysSongPlaylist } =
    useSongContext();

  const [isFetching, setIsFetching] = useState(true);

  type GetUserSongAndPlaylistProps = {
    variant: "user";
    email: string;
  };

  type GetSystemSongPlaylist = {
    variant: "system";
  };

  const getSongAndPlaylist = async (
    props: GetSystemSongPlaylist | GetUserSongAndPlaylistProps
  ) => {
    try {
      if (appConfig.isDev) {
        await sleep(appConfig.loadingDuration);
        setSysSongPlaylist({ playlists: devPlaylists, songs: devSongs });

        return;
      }

      switch (props.variant) {
        case "system":
          const sysSongs = await appService.getSongs({
            variant: "system",
          });
          const sysPlaylists = await appService.getPlaylists({ variant: "system" });

          setSysSongPlaylist({ playlists: sysPlaylists || [], songs: sysSongs || [] });

          break;
        //   case "user":
        //     if (shouldFetchUserSongPlaylist.current) {
        //       shouldFetchUserSongPlaylist.current = true;
        //       const { userPlaylists, userSongs } =
        //         await appService.getUserSongsAndPlaylists(props.email);

        //       setSongs(userSongs);
        //       setPlaylists(userPlaylists);
        //     } else await sleep(300);

        //     break;
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, getSongAndPlaylist, playlists, sysSongPlaylist };
}

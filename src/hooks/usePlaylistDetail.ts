import { Playlist, Song } from "../types";
import { useEffect, useState, MutableRefObject, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useToast } from "../store/ToastContext";
import { setPlaylist } from "../store/SongSlice";
import { useSongsStore } from "../store/SongsContext";

import { generateId } from "../utils/appHelpers";
import {
  myGetDoc,
  mySetDoc,
  updatePlaylistsValue,
} from "../utils/firebaseHelpers";

type Props = {
  playlistInStore: Playlist;
  initial: boolean;
  firstTimeRender: MutableRefObject<boolean>;
};

export default function usePlaylistDetail({
  firstTimeRender,
  initial,
  playlistInStore,
}: Props) {
  // use store
  const dispatch = useDispatch();
  const { setErrorToast } = useToast();
  const { userData, adminSongs, userSongs, userPlaylists, setUserPlaylists } =
    useSongsStore();
  const params = useParams();

  // hook state
  const [loading, setLoading] = useState(false);
  const [PlaylistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [errorMsg, setErrorMsg] = useState("");

  // get playlist data
  const getPlaylist = useCallback(async () => {
    console.log("run getPlaylist after initial");

    try {
      setLoading(true);

      const playlistId = generateId(params.name as string, userData.email);
      const playlistSnap = await myGetDoc({
        collection: "playlist",
        id: playlistId,
      });

      if (playlistSnap.exists()) {
        const playlistData = playlistSnap.data() as Playlist;

        dispatch(setPlaylist(playlistData));
      } else {
        setErrorMsg("Playlist not found");
        setErrorToast({});
      }
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
    }
  }, [params, userData]);

  // // get playlist song
  const getPlaylistSongs = useCallback(() => {
    // console.log("get playlist songs check ids", playlistInStore.song_ids);

    if (!playlistInStore.song_ids.length) {
      setPlaylistSongs([]);
      return;
    }

    let newSongs: Song[];
    let i = 0;
    switch (playlistInStore.by) {
      case "admin":
        const tarGetSongsList = [...adminSongs];

        newSongs = tarGetSongsList.filter((adminSong) => {
          if (i === playlistInStore.song_ids.length) return;

          const condition = playlistInStore.song_ids.find(
            (songId) => songId === adminSong.id
          );

          if (condition) i += 1;
          return condition;
        });

        break;
      default:
        newSongs = userSongs.filter((useSong) => {
          if (i === playlistInStore.song_ids.length) return;

          const condition = playlistInStore.song_ids.find(
            (songId) => songId === useSong.id
          );

          if (condition) i += 1;
          return condition;
        });
    }

    setPlaylistSongs(newSongs);
  }, [playlistInStore.song_ids, userSongs]);

  useEffect(() => {
    if (playlistInStore.name) {
      setLoading(false);
      return;
    }
    if (!initial) return;

    getPlaylist();
  }, [initial]);

  // for get playlist songs
  useEffect(() => {
    if (!playlistInStore) return;

    if (firstTimeRender.current) {
      firstTimeRender.current = false;
      return;
    }
    getPlaylistSongs();
  }, [playlistInStore.song_ids]);

  // for update playlist feature image
  useEffect(() => {
    if (firstTimeRender.current) return;

    if (!PlaylistSongs.length) return;

    const firstSongHasImage = PlaylistSongs.find((song) => song.image_url);

    if (
      !firstSongHasImage ||
      (playlistInStore.image_url &&
        playlistInStore.image_url === firstSongHasImage.image_url)
    )
      return;

    console.log("get playlist feature image");

    const newPlaylist: Playlist = {
      ...playlistInStore,
      image_url: firstSongHasImage.image_url,
    };

    const setPlaylistImageToDoc = async () => {
      try {
        await mySetDoc({
          collection: "playlist",
          id: playlistInStore.id,
          data: newPlaylist,
        });
      } catch (error) {
        console.log("error when set playlist image");
        setErrorToast({});
      }
    };

    setPlaylistImageToDoc();
    // get new user playlist
    const newUserPlaylists = [...userPlaylists];
    updatePlaylistsValue(newPlaylist, newUserPlaylists);

    // update playlistInStore first
    // because the user can be in playlist detail page
    dispatch(setPlaylist(newPlaylist));

    // update users playlist to context
    setUserPlaylists(newUserPlaylists, []);
  }, [PlaylistSongs]);

  return { PlaylistSongs, loading, errorMsg };
}

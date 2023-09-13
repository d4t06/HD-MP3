import { doc, getDoc } from "firebase/firestore";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { Playlist } from "../types";
import { db } from "../config/firebase";
import { useParams } from "react-router-dom";
import useUserSong from "./useUserSong";

export default function usePlaylistDetail() {
  const dispatch = useDispatch();

  const {
    userData,
    songs: userSongs,
    loading: useUserSongLoading,
    initial,
  } = useUserSong();

  const { playlist: playlistInStore } = useSelector(selectAllSongStore);

  const [playlistSongIndexes, setPlaylistSongIndexes] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);
  const isInitDone = useRef(false);

  const params = useParams();

  // get playlist song indexes
  const getSongIndexes = useCallback(() => {
    console.log("getSongIndexes");

    const indexes = playlistInStore.song_ids.map((id) => {
      return userSongs.findIndex((song) => song.id === id);
    });
    setPlaylistSongIndexes(indexes);
  }, [playlistInStore]);

  // get playlist data
  const getPlaylist = useCallback(async () => {
   
    try {
      setLoading(true);
      const playlistSnap = await getDoc(
        doc(db, "playlist", `${params.name}_${userData.email}` as string)
      );
      if (playlistSnap) {
        const playlistData = playlistSnap.data() as Playlist;
      console.log('getPlaylist detail', playlistData);


        dispatch(setPlaylist(playlistData));
      }
      isInitDone.current = true;
    } catch (error) {
      console.log({ message: error });
    } finally {
      setLoading(false);
    }
  }, [params, userData]);

  useEffect(() => {
    if (useUserSongLoading) return;
    if (!userData.email) {
      initial();
      return;
    }
    if (!isInitDone.current) getPlaylist()
  }, [playlistInStore, useUserSongLoading]);


  console.log("use playlist detail render");
  

  return {
    playlistSongIndexes,
    playlistInStore,
    playlistId: `${params.name}_${userData.email}`,
    userSongs,
    loading,
  };
}

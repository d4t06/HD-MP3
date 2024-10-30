import { useParams } from "react-router-dom";
import { myGetDoc } from "@/services/firebaseService";
import { PlaylistParamsType } from "../routes";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "../store";
import { useEffect, useRef, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { selectCurrentPlaylist, setCurrentPlaylist } from "@/store/currentPlaylistSlice";

export default function useGetPlaylist() {
  // store
  const dispatch = useDispatch();

  // hooks
  const params = useParams<PlaylistParamsType>();
  const { setErrorToast } = useToast();

  // state
  const ranEffect = useRef(false);
  const [isFetching, setIsFetching] = useState(true);

  const getPlaylist = async () => {
    if (!params.id) throw new Error("invalid playlist id");

    const playlistSnap = await myGetDoc({
      collection: "playlist",
      id: params.id,
      msg: ">>> api get playlist",
    });

    if (playlistSnap.exists()) return playlistSnap.data() as Playlist;
  };

  const getSongs = async (playlist: Playlist) => {
    if (!playlist.song_ids.length) return [];

    console.log("chekc playlist", playlist);

    const songsRef = collection(db, "songs");

    const queryGetSongs = query(songsRef, where("id", "in", playlist.song_ids));
    const songsSnap = await getDocs(queryGetSongs);

    if (songsSnap.docs.length) {
      const songs = songsSnap.docs.map(
        (doc) =>
          ({
            ...doc.data(),
            song_in: `playlist_${playlist.id}`,
          } as SongWithSongIn)
      );
      return songs;
    }

    setErrorToast();
    return [];
  };

  const init = async () => {
    try {
      if (!params.id) throw new Error("invalid playlist id");

      setIsFetching(true);

      const playlist = await getPlaylist();
      if (!playlist) throw new Error("");

      const playlistSongs = await getSongs(playlist);

      dispatch(
        setCurrentPlaylist({
          playlist: playlist,
          songs: playlistSongs,
        })
      );
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      init();
    }
  }, []);

  return { isFetching };
}

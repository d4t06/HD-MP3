import { useToastContext } from "@/stores";
import { useEffect, useRef } from "react";
import { query, where } from "firebase/firestore";
import {
  myGetDoc,
  playlistCollectionRef,
  songsCollectionRef,
} from "@/services/firebaseService";
import { useNavigate, useParams } from "react-router-dom";
import { implementPlaylistQuery, implementSongQuery } from "@/services/appService";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { useGetSingerContext } from "../_components/GetSingerContext";

export default function useGetSinger() {
  const { setSinger, setSongs, setPlaylists, setAlbums } = useSingerContext();
  const { setErrorToast } = useToastContext();
  const { setIsFetching } = useGetSingerContext();

  const params = useParams();
  const navigator = useNavigate();

  const ranEffect = useRef(false);

  const getSinger = async () => {
    try {
      if (!params.id) return;

      const singerSnap = await myGetDoc({ collectionName: "Singers", id: params.id });
      if (!singerSnap.exists()) navigator("/dashboard/singer");

      const singer: Singer = { ...(singerSnap.data() as SingerSchema), id: params.id };

      const queryGetSongs = query(
        songsCollectionRef,
        where(`singer_map.${singer.id}`, "==", true),
      );
      const songs = await implementSongQuery(queryGetSongs);

      const queryGetPlaylists = query(
        playlistCollectionRef,
        where(`singer_map.${singer.id}`, "==", true),
      );
      const playlistsAndAlbums = await implementPlaylistQuery(queryGetPlaylists);

      const playlists: Playlist[] = [];
      const albums: Playlist[] = [];

      playlistsAndAlbums.forEach((p) =>
        p.is_album ? albums.push(p) : playlists.push(p),
      );

      setSinger(singer);
      setPlaylists(playlists);
      setAlbums(albums);
      setSongs(songs);
    } catch (error) {
      console.log({ error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getSinger();
    }
  }, []);
}

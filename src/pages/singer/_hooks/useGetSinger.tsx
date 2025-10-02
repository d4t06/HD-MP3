import { useToastContext } from "@/stores";
import { useSingerContext } from "../_components/SingerContext";
import { useEffect, useState } from "react";
import { query, where } from "firebase/firestore";
import {
  myGetDoc,
  playlistCollectionRef,
  songsCollectionRef,
} from "@/services/firebaseService";
import { useParams } from "react-router-dom";
import {
  implementPlaylistQuery,
  implementSongQuery,
} from "@/services/appService";
import { nanoid } from "nanoid/non-secure";

export default function useGetSinger() {
  const {
    setIsFetching,
    setSinger,
    setAlbums,
    isFetching,
    setSongs,
    singer,
    setPlaylists,
  } = useSingerContext();
  const { setErrorToast } = useToastContext();

  const [singerId, setSingeId] = useState<string>();

  const params = useParams();

  const getSinger = async () => {
    try {
      if (!singerId) return;
      setIsFetching(true);

      const singerSnap = await myGetDoc({
        collectionName: "Singers",
        id: singerId,
      });
      if (!singerSnap.exists()) return;

      const singer: Singer = {
        ...(singerSnap.data() as SingerSchema),
        id: singerId,
      };

      const queryGetSongs = query(
        songsCollectionRef,
        where(`singer_map.${singer.id}`, "==", true),
      );
      const songs = await implementSongQuery(queryGetSongs, {
        getQueueId: () => nanoid(4) + "_" + singer.id,
      });

      const queryGetPlaylists = query(
        playlistCollectionRef,
        where(`singer_map.${singer.id}`, "==", true),
      );
      const playlistsAndAlbums =
        await implementPlaylistQuery(queryGetPlaylists);

      const playlists: Playlist[] = [];
      const albums: Playlist[] = [];

      playlistsAndAlbums.forEach((p) =>
        p.is_album ? albums.push(p) : playlists.push(p),
      );

      setSongs(songs);
      setSinger(singer);
      setPlaylists(playlists);
      setAlbums(albums);
    } catch (error) {
      console.log({ error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    setSingeId(params.id);
  }, [params]);

  useEffect(() => {
    if (!singerId) return;

    getSinger();
  }, [singerId]);

  useEffect(() => {
    if (singer) document.title = singer.name;
  }, [singer]);

  return { singer, isFetching };
}

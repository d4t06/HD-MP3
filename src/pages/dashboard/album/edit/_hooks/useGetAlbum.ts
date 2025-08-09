import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlbumContext } from "../AlbumContext";
import { documentId, query, where } from "firebase/firestore";
import { implementSongQuery } from "@/services/appService";

export default function useGetAlbum() {
  const { setAlbum, setSongs } = useAlbumContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranEffect = useRef(false);

  const params = useParams();
  const navigator = useNavigate();

  const { setErrorToast } = useToastContext();

  const getAlbum = async () => {
    try {
      if (!params.id) return;

      const docRef = await myGetDoc({
        collectionName: "Playlists",
        id: params.id,
      });

      if (!docRef.exists()) return navigator("/dashboard/album");

      const album: Playlist = {
        ...(docRef.data() as PlaylistSchema),
        id: docRef.id,
      };

      if (!album.is_album) return navigator(`/dashboard/playlist/${album.id}`);

      if (album.song_ids.length) {
        const queryGetSongs = query(
          songsCollectionRef,
          where(documentId(), "in", album.song_ids),
        );

        const result = await implementSongQuery(queryGetSongs);
        setSongs(result);
      }

      setAlbum(album);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getAlbum();
    }
  }, []);

  return { isFetching };
}

import { myGetDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function useGetAlbum() {
  const [isFetching, setIsFetching] = useState(true);

  const [album, setAlbum] = useState<Playlist>();

  const ranEffect = useRef(false);

  const params = useParams();
  const navigator = useNavigate();

  const { setErrorToast } = useToastContext();

  const getAlbum = async () => {
    try {
      if (!params.id) return;

      const docRef = await myGetDoc({ collectionName: "Playlists", id: params.id });

      if (!docRef.exists()) return navigator("/dashboard/album");

      const album: Playlist = {
        ...(docRef.data() as PlaylistSchema),
        id: docRef.id,
      };

      if (!album.is_album) return navigator(`/dashboard/playlist/${album.id}`);

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

  return { album, isFetching };
}

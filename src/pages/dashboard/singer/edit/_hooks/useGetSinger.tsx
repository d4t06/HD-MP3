import { useToastContext } from "@/stores";
import { useEffect, useRef } from "react";
import { query, where } from "firebase/firestore";
import { myGetDoc, songsCollectionRef } from "@/services/firebaseService";
import { useNavigate, useParams } from "react-router-dom";
import { implementSongQuery } from "@/services/appService";
import { nanoid } from "nanoid/non-secure";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import { useGetSingerContext } from "../_components/GetSingerContext";

export default function useGetSinger() {
  const { setSinger, setSongs } = useSingerContext();
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
        where(`singer_map.${singer.id}`, "==", true)
      );

      const songs = await implementSongQuery(queryGetSongs, {
        getQueueId: () => nanoid(4) + "_" + singer.id,
      });

      setSinger(singer);
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

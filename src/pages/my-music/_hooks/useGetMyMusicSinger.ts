import { implementSingerQuery } from "@/services/appService";
import { singerCollectionRef } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { documentId, query, where } from "firebase/firestore";
import { useState } from "react";

// this hook not in useEffect
export default function useGetMyMusicSinger() {
  const { user } = useAuthContext();
  const { shouldFetchUserSingers, setSingers, singers } = useSongContext();

  const { setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(true);

  const getSinger = async () => {
    try {
      if (!user) return;

      setIsFetching(true);

      if (shouldFetchUserSingers.current && !!user.liked_singer_ids.length) {
        shouldFetchUserSingers.current = false;

        const queryGetSingers = query(
          singerCollectionRef,
          where(documentId(), "in", user.liked_singer_ids),
        );

        const result = await implementSingerQuery(queryGetSingers);

        setSingers(result);
        return result;
      } else {
        await sleep(100);
        return singers;
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, singers, user, setIsFetching, getSinger };
}

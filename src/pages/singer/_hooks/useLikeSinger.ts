import { db } from "@/firebase";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { doc, increment, writeBatch } from "firebase/firestore";
import { useState } from "react";

export default function useLikeSinger() {
  const { user, updateUserData } = useAuthContext();
  const { setSingers } = useSongContext();
  const { setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type LikeProps = {
    singer: Singer;
  };

  const likeSinger = async ({ singer }: LikeProps) => {
    try {
      setIsFetching(true);
      if (!user) return;

      const batch = writeBatch(db);

      const userRef = doc(db, "Users", user.email);
      const singerRef = doc(db, "Singers", singer.id);

      const newLikedSignerIds = [...user.liked_singer_ids];
      const index = newLikedSignerIds.findIndex((id) => id === singer.id);

      const isLike = index === -1;

      if (isLike) newLikedSignerIds.unshift(singer.id);
      else newLikedSignerIds.splice(index, 1);

      const newUserData: Partial<User> = {
        liked_singer_ids: newLikedSignerIds,
      };

      const newSingerData = {
        like: increment(isLike ? 1 : -1),
      };

      batch.update(userRef, newUserData);
      batch.update(singerRef, newSingerData);

      await batch.commit();

      // should fetch new data or update data local ?
      if (isLike) {
        setSuccessToast("Liked");
        setSingers((prev) => [singer, ...prev]);
      } else {
        setSingers((prev) => prev.filter((p) => p.id !== singer.id));
        setSuccessToast("Disliked");
      }

      updateUserData(newUserData);
    } catch (error) {
      console.log({ error });
    } finally {
      setIsFetching(false);
    }
  };

  return { likeSinger, isFetching, user };
}

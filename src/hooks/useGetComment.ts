import { getDocs, orderBy, query, where } from "firebase/firestore";
import { commentCollectionRef } from "@/services/firebaseService";
import { useState } from "react";
import { useToastContext } from "@/stores";

type Props = {
  setIsFetchingFromParent: (v: boolean) => void;
};

export default function useGetComment(props?: Props) {
  const { setIsFetchingFromParent } = props || {};

  const [isFetching, setIsFetching] = useState(true);

  const { setErrorToast } = useToastContext();

  const _setIsFetching = setIsFetchingFromParent || setIsFetching;

  const fetchComment = async ({
    target_id,
    comment_id,
  }: {
    target_id?: string;
    comment_id?: string;
  }) => {
    try {
      _setIsFetching(true);

      if (import.meta.env.DEV) console.log("get comment");

      const searchQuery = target_id
        ? query(
            commentCollectionRef,
            where("target_id", "==", target_id),
            orderBy("created_at", "desc"),
          )
        : query(
            commentCollectionRef,
            where("comment_id", "==", comment_id),
            orderBy("created_at", "desc"),
          );

      const commentSnaps = await getDocs(searchQuery);

      if (!!commentSnaps.docs.length) {
        const result = commentSnaps.docs.map((doc) => {
          const comments: UserComment = {
            ...(doc.data() as UserCommentSchema),
            id: doc.id,
            replies: [],
          };
          return comments;
        });

        return result;
      }
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      _setIsFetching(false);
    }
  };

  return { fetchComment, isFetching };
}

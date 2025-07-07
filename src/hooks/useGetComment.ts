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

      let searchQuery = query(commentCollectionRef);

      if (target_id) {
        searchQuery = query(
          searchQuery,
          where("target_id", "==", target_id),
          where("comment_id", "==", ""),
          orderBy("updated_at", "desc"),
        );
      }

      if (comment_id)
        searchQuery = query(
          searchQuery,
          where("comment_id", "==", comment_id),
          orderBy("created_at", "asc"),
        );

      const commentSnaps = await getDocs(searchQuery);

      if (!!commentSnaps.docs.length) {
        const result = commentSnaps.docs.map((doc) => {
          const singer: UserComment = {
            ...(doc.data() as UserCommentSchema),
            id: doc.id,
            replies: [],
          };
          return singer;
        });

        return result;
      }
    } catch (error) {
      setErrorToast();
    } finally {
      _setIsFetching(false);
    }
  };

  return { fetchComment, isFetching };
}

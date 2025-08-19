import { db } from "@/firebase";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

type Props = {
  category_ids: string[];
};

export default function useGetCategories({ category_ids }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isFetching, setIsFetching] = useState(true);

  const ranEffect = useRef(false);

  const getCategories = async () => {
    try {
      if (!category_ids.length) return;

      if (import.meta.env.DEV) console.log("Get categories");

      setIsFetching(true);

      const q = query(
        collection(db, "Categories"),
        where(documentId(), "in", category_ids),
      );
      const snap = await getDocs(q);

      if (!snap.empty) {
        const result: Category[] = snap.docs.map((d) => ({
          ...(d.data() as CategorySchema),
          id: d.id,
        }));

        setCategories(result);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = true;

      getCategories();
    }
  }, []);

  return { categories, isFetching };
}

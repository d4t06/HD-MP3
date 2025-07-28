import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { myGetDoc } from "@/services/firebaseService";

type Props = {
  setCategory: (c: Category) => void;
  initIsFetching?: boolean;
};

export default function useGetCategory({ setCategory }: Props) {
  const [isFetching, setIsFetching] = useState(true);
  const ranEffect = useRef(false);

  const { id } = useParams<{ id: string }>();

  const getPage = async () => {
    try {
      if (!id) return;
      setIsFetching(true);

      const snap = await myGetDoc({ collectionName: "Categories", id });

      if (snap.exists()) {
        const category: Category = { ...(snap.data() as CategorySchema), id };

        setCategory(category);
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

      getPage();
    }
  }, []);

  return { isFetching };
}

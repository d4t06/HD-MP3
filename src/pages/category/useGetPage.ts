import { db } from "@/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetPage() {
  const [page, setPage] = useState<CategoryLobby>();
  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  const getPage = async () => {
    try {
      setIsFetching(true);

      const q = query(collection(db, "Category_Lobby"));
      const snap = await getDocs(q);

      if (!snap.empty) {
        setPage(snap.docs[0].data() as CategoryLobby);
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

  return { page, isFetching };
}

import { db } from "@/firebase";
import { useCategoryLobbyContext } from "@/pages/category/CategoryLobbyContext";
import { useToastContext } from "@/stores";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetPage() {
  const { setErrorToast } = useToastContext();
  const { page, setPage } = useCategoryLobbyContext();

  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  const getPage = async () => {
    try {
      setIsFetching(true);

      let pageConfig: CategoryLobby = {
        category_ids: [],
        category_sections: [],
        playlist_sections: [],
      };

      const docRef = doc(db, "Category_Lobby", "page");

      const snap = await getDoc(docRef);

      if (!snap.exists) {
        await setDoc(docRef, pageConfig);
      } else {
        pageConfig = snap.data() as CategoryLobby;
      }

      setPage(pageConfig);
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

      getPage();
    }
  }, []);

  return { page, isFetching };
}

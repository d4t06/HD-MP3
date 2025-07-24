import { db } from "@/firebase";
import { useCategoryLobbyContext } from "../CategoryLobbyContext";
import { useToastContext } from "@/stores";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";

export default function useGetPage() {
  const { setErrorToast } = useToastContext();
  const { page, setPage, setCategories } = useCategoryLobbyContext();

  const [isFetching, setIsFetching] = useState(false);

  const ranEffect = useRef(false);

  const getPage = async () => {
    try {
      setIsFetching(true);

      let pageConfig: CategoryLobby = {
        category_ids: [],
        category_sections: [],
        playlist_sections: [],
        updated_at: serverTimestamp(),
      };
      let _categories: Category[] = [];

      const docRef = doc(db, "Category_Lobby", "page");

      const snap = await getDoc(docRef);
      const categoriesSnap = await getDocs(query(collection(db, "Categories")));

      if (!snap.exists()) {
        await setDoc(docRef, pageConfig);
      } else {
        pageConfig = snap.data() as CategoryLobby;
      }

      if (!categoriesSnap.empty) {
        _categories = categoriesSnap.docs.map((d) => ({
          ...(d.data() as CategorySchema),
          id: d.id,
        }));
      }

      setCategories(_categories);
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

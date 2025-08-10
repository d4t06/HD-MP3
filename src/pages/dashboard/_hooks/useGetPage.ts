import { db } from "@/firebase";
import { useToastContext } from "@/stores";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import { usePageContext } from "@/stores";
import { myGetDoc } from "@/services/firebaseService";
import { sleep } from "@/utils/appHelpers";

export default function useGetPage() {
  const { setErrorToast } = useToastContext();
  const { setCategoryPage, shouldFetch, setHomePage, setCategories } =
    usePageContext();

  const [isFetching, setIsFetching] = useState(true);

  const ranEffect = useRef(false);

  const getPage = async () => {
    try {
      setIsFetching(true);

      if (shouldFetch.current) {
        shouldFetch.current = false;
      } else {
        await sleep(100);
        return;
      }

      const initPage = {
        category_ids: "",
        category_sections: [],
        playlist_sections: [],
        updated_at: serverTimestamp(),
      };

      let _categoryPage: PageConfig = { ...initPage };

      let _homePage: PageConfig = { ...initPage };

      let _categories: Category[] = [];

      const categoryDocRef = doc(db, "Page_Config", "category");
      const homeDocRef = doc(db, "Page_Config", "home");

      const [categorySnap, homeSnap] = await Promise.all([
        myGetDoc({
          collectionName: "Page_Config",
          id: "category",
          msg: "Get category config",
        }),
        myGetDoc({
          collectionName: "Page_Config",
          id: "home",
          msg: "Get home config",
        }),
      ]);

      const categoriesSnap = await getDocs(query(collection(db, "Categories")));

      if (!categorySnap.exists()) {
        await setDoc(categoryDocRef, _categoryPage);
      } else {
        _categoryPage = categorySnap.data() as PageConfig;
      }

      if (!homeSnap.exists()) {
        await setDoc(homeDocRef, _homePage);
      } else {
        _homePage = homeSnap.data() as PageConfig;
      }

      if (!categoriesSnap.empty) {
        _categories = categoriesSnap.docs.map((d) => ({
          ...(d.data() as CategorySchema),
          id: d.id,
        }));
      }

      setCategories(_categories);
      setCategoryPage(_categoryPage);
      setHomePage(_homePage);
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (!ranEffect.current) {
      ranEffect.current = false;

      getPage();
    }
  }, []);

  return { isFetching };
}

import { myGetDoc } from "@/services/firebaseService";
import { usePageContext } from "@/stores";
import { useEffect, useState } from "react";

export default function useGetPage() {
  const { setCategoryPage, setHomePage, shouldFetch } = usePageContext();
  const [isFetching, setIsFetching] = useState(true);

  const getPage = async () => {
    try {
      setIsFetching(true);

      const initPage: PageConfig = {
        category_ids: "",
        category_sections: [],
        playlist_sections: [],
        updated_at: "",
      };

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

      setCategoryPage(
        categorySnap.exists() ? (categorySnap.data() as PageConfig) : initPage,
      );
      setHomePage(
        homeSnap.exists() ? (homeSnap.data() as PageConfig) : initPage,
      );
    } catch (error) {
      console.log(error);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (shouldFetch.current) {
      shouldFetch.current = false;

      getPage();
    } else {
      setTimeout(() => setIsFetching(false), 300);
    }
  }, []);

  return { isFetching };
}

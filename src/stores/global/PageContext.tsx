import {
  createContext,
  ReactNode,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

function usePage() {
  const [categoryPage, setCategoryPage] = useState<PageConfig>();
  const [homePage, setHomePage] = useState<PageConfig>();
  const [categories, setCategories] = useState<Category[]>([]);

  const shouldFetch = useRef(true);

  const categorySliders = useMemo(() => {
    const result: Category[] = [];

    const order = categoryPage?.category_ids
      ? categoryPage.category_ids.split("_")
      : [];

    order.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [categoryPage, categories]);

  const homeSliders = useMemo(() => {
    const result: Category[] = [];

    const order = homePage?.category_ids
      ? homePage.category_ids.split("_")
      : [];

    order.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [homePage, categories]);

  return {
    categoryPage,
    setCategoryPage,
    homePage,
    setHomePage,
    categories,
    setCategories,
    categorySliders,
    homeSliders,
    shouldFetch,
  };
}

type ContextType = ReturnType<typeof usePage>;

const Context = createContext<ContextType | null>(null);

export default function PageProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={usePage()}>{children}</Context.Provider>;
}

export const usePageContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("PageProvider is not provided");

  return ct;
};

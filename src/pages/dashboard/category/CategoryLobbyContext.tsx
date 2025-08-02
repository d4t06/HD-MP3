import { createContext, ReactNode, useMemo, useState } from "react";

function useCategoryLobby() {
  const [categoryPage, setCategoryPage] = useState<PageConfig>();
  const [HomePage, setHomePage] = useState<PageConfig>();
  const [categories, setCategories] = useState<Category[]>([]);

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

    const order = HomePage?.category_ids
      ? HomePage.category_ids.split("_")
      : [];

    order.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [HomePage, categories]);

  return {
    categoryPage,
    setCategoryPage,
    HomePage,
    setHomePage,
    categories,
    setCategories,
    categorySliders,
    homeSliders,
  };
}

type ContextType = ReturnType<typeof useCategoryLobby>;

const Context = createContext<ContextType | null>(null);

export default function CategoryLobbyProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Context.Provider value={useCategoryLobby()}>{children}</Context.Provider>
  );
}

// export const useCategoryLobbyContext = () => {
//   const ct = useContext(Context);

//   if (!ct) throw new Error("CategoryLobbyProvider is not provided");

//   return ct;
// };

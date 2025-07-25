import { createContext, ReactNode, useContext, useMemo, useState } from "react";

function useCategoryLobby() {
  const [page, setPage] = useState<CategoryLobby>();
  const [categories, setCategories] = useState<Category[]>([]);

  const orderedSliders = useMemo(() => {
    const result: Category[] = [];

    const order = page?.category_ids ? page.category_ids.split("_") : [];

    order.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [page, categories]);

  return {
    page,
    setPage,
    categories,
    setCategories,
    orderedSliders,
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

export const useCategoryLobbyContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("CategoryLobbyProvider is not provided");

  return ct;
};

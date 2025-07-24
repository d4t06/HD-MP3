import { createContext, ReactNode, useContext, useState } from "react";

function useCategory() {
	const [category, setCategory] = useState<Category>();

	return {
		category,
		setCategory,
	};
}

type ContextType = ReturnType<typeof useCategory>;

const Context = createContext<ContextType | null>(null);

export default function CategoryProvider({
	children,
}: {
	children: ReactNode;
}) {
	return <Context.Provider value={useCategory()}>{children}</Context.Provider>;
}

export const useCategoryContext = () => {
	const ct = useContext(Context);

	if (!ct) throw new Error("CategoryProvider is not provided");

	return ct;
};

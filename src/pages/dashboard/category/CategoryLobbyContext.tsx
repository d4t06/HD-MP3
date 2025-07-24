import { createContext, ReactNode, useContext, useState } from "react";

function useCategoryLobby() {
	const [page, setPage] = useState<CategoryLobby>();
	const [categories, setCategories] = useState<Category[]>([]);

	return {
		page,
		setPage,
		categories,
		setCategories,
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

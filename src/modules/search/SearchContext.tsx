import { createContext, ReactNode, useContext, useState } from "react";

const useSearch = () => {
	const [isFocus, setIsFocus] = useState(false);

	return { isFocus, setIsFocus };
};

type ContextType = ReturnType<typeof useSearch>;

const context = createContext<ContextType | null>(null);

export default function SearchProvider({ children }: { children: ReactNode }) {
	return <context.Provider value={useSearch()}>{children}</context.Provider>;
}

export const useSearchContext = () => {
	const ct = useContext(context);
	if (!ct) throw new Error("SearchProvider");

	return ct;
};

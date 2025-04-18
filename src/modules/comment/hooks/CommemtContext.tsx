import { ReactNode, createContext, useState } from "react";

function useComment() {
	const [comments, setComments] = useState<UserComment[]>([]);

	return { comments, setComments };
}

type ContextType = ReturnType<typeof useComment>;

const context = createContext<ContextType | null>(null);

export default function CommnetProvider({ children }: { children: ReactNode }) {
	return <context.Provider value={useComment()}>{children}</context.Provider>;
}

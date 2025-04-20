import { ReactNode, createContext, useContext, useRef, useState } from "react";

type Props = {
	target: "song" | "playlist";
};

function useComment({ target }: Props) {
	const [comments, setComments] = useState<UserComment[]>([]);
	const [isOpenComment, setIsOpenComment] = useState(false);
	const [isFetching, setIsFetching] = useState(true);

	const shouldFetchComment = useRef(true);

	return {
		target,
		comments,
		isOpenComment,
		setIsOpenComment,
		setComments,
		shouldFetchComment,
		isFetching,
		setIsFetching,
	};
}

type ContextType = ReturnType<typeof useComment>;

const context = createContext<ContextType | null>(null);

export default function CommnetProvider({
	children,
	target,
}: { children: ReactNode } & Props) {
	return (
		<context.Provider
			value={useComment({
				target,
			})}
		>
			{children}
		</context.Provider>
	);
}

export function useCommentContext() {
	const ct = useContext(context);
	if (!ct) throw new Error("CommnetProvider not provided");

	return ct;
}

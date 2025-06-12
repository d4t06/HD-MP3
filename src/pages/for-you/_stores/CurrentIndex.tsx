import {
	createContext,
	useContext,
	useRef,
	useState,
	type ReactNode,
} from "react";

function useCurrentIndex() {
	const [currentIndex, setCurrentIndex] = useState(999);
	const firstTimeSongLoaded = useRef(true);

	return {
		currentIndex,
		setCurrentIndex,
		firstTimeSongLoaded,
	};
}

type ContextType = ReturnType<typeof useCurrentIndex>;

const context = createContext<ContextType | null>(null);

export default function CurrrentIndexProvider({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<context.Provider value={useCurrentIndex()}>{children}</context.Provider>
	);
}

export function uesCurrentIndexContext() {
	const ct = useContext(context);
	if (!ct) throw new Error("CurrrentIndexProvider not provided");

	return ct;
}

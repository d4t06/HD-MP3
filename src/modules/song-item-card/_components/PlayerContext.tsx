import {
	createContext,
	useContext,
	useRef,
	useState,
	type ReactNode,
} from "react";

type Status = "playing" | "paused" | "error" | "loading" | "idle";

export type SongControlRef = {
	pause: () => void;
	play: () => void;
	handlePlayPause: () => void;
};

function usePlayer() {
	const [status, setStatus] = useState<Status>("idle");
	const controlRef = useRef<SongControlRef>(null);
	const [lyrics, setLyrics] = useState<Lyric[]>([]);

	const [canPlay, setCanPlay] = useState(false);

	const statusRef = useRef<Status>("idle");
	const shouldGetLyric = useRef(true);
	const shouldPlayAfterLoaded = useRef(true);

	return {
		status,
		setStatus,
		statusRef,
		controlRef,
		canPlay,
		setCanPlay,
		lyrics,
		setLyrics,
		shouldGetLyric,
		shouldPlayAfterLoaded,
	};
}

type ContextType = ReturnType<typeof usePlayer>;

const context = createContext<ContextType | null>(null);

export default function PlayerProvider({ children }: { children: ReactNode }) {
	return <context.Provider value={usePlayer()}>{children}</context.Provider>;
}

export function usePlayerContext() {
	const ct = useContext(context);
	if (!ct) throw new Error("PlayerProvider not provided");

	return ct;
}

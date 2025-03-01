import { ReactNode, createContext, useContext, useState } from "react";

function useAddSong() {
	const [songFile, setSongFile] = useState<File>();
	const [songData, setSongData] = useState<SongSchema>();

	const updateSongData = (data?: Partial<SongSchema>) => {
		if (!songData) return;
		setSongData({ ...songData, ...data });
	};

	return { songFile, setSongFile, songData, setSongData, updateSongData };
}

type ContextType = ReturnType<typeof useAddSong>;

const Context = createContext<ContextType | null>(null);

export default function AddSongProvider({ children }: { children: ReactNode }) {
	return <Context.Provider value={useAddSong()}>{children}</Context.Provider>;
}

export const useAddSongContext = () => {
	const ct = useContext(Context);
	if (!ct) throw new Error("AddSongProvider not provided");
	return ct;
};

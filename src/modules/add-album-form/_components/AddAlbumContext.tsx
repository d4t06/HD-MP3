import { ReactNode, createContext, useContext, useState } from "react";

function useAddAlbum() {
	const [singer, setSinger] = useState<Singer>();
	const [songs, setSongs] = useState<Song[]>([]);
	const [albumData, setAlbumData] = useState<PlaylistSchema>();
	const [imageFile, setImageFile] = useState<File>();
	const [album, setAlbum] = useState<Playlist>();

	const updateAlbumData = (data?: Partial<PlaylistSchema>) => {
		if (!albumData) return;
		setAlbumData({ ...albumData, ...data });
	};

	return {
		singer,
		setSinger,
		songs,
		setSongs,
		updateAlbumData,
		albumData,
		imageFile,
		setImageFile,
		setAlbumData,
		album,
		setAlbum,
	};
}

type ContextType = ReturnType<typeof useAddAlbum>;

const Context = createContext<ContextType | null>(null);

export default function AddAlbumProvider({ children }: { children: ReactNode }) {
	return <Context.Provider value={useAddAlbum()}>{children}</Context.Provider>;
}

export function useAddAlbumContext() {
	const ct = useContext(Context);
	if (!ct) throw new Error("AddAlbumProvider not provided");

	return ct;
}

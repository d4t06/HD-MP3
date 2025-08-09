import { ReactNode, createContext, useContext, useState } from "react";

function useAlbum() {
  const [album, setAlbum] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);

  const [imageFile, setImageFile] = useState<File>();

  const updatePlaylistData = (data?: Partial<PlaylistSchema>) => {
    if (!album) return;
    setAlbum({ ...album, ...data });
  };

  return {
    imageFile,
    setImageFile,
    album,
    setAlbum,
    updatePlaylistData,
    songs,
    setSongs,
  };
}

type ContextType = ReturnType<typeof useAlbum>;

const Context = createContext<ContextType | null>(null);

export default function AlbumProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useAlbum()}>{children}</Context.Provider>;
}

export const useAlbumContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("AlbumProvider not provided");
  return ct;
};

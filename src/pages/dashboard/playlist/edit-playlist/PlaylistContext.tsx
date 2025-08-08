import { ReactNode, createContext, useContext, useState } from "react";

function usePlaylist() {
  const [playlist, setPlaylist] = useState<Playlist>();
  const [songs, setSongs] = useState<Song[]>([]);

  const [imageFile, setImageFile] = useState<File>();

  const updatePlaylistData = (data?: Partial<PlaylistSchema>) => {
    if (!playlist) return;
    setPlaylist({ ...playlist, ...data });
  };

  return {
    imageFile,
    setImageFile,
    playlist,
    setPlaylist,
    updatePlaylistData,
    songs,
    setSongs,
  };
}

type ContextType = ReturnType<typeof usePlaylist>;

const Context = createContext<ContextType | null>(null);

export default function PlaylistProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <Context.Provider value={usePlaylist()}>{children}</Context.Provider>;
}

export const usePlaylistContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("PlaylistProvider not provided");
  return ct;
};

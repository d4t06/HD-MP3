import { ReactNode, createContext, useContext, useState } from "react";

const useCurrenPlaylist = () => {
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);

  return { currentPlaylist, setCurrentPlaylist, playlistSongs, setPlaylistSongs };
};

type ContextType = ReturnType<typeof useCurrenPlaylist>;

const Context = createContext<ContextType | null>(null);

export default function CurrentPlaylistProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useCurrenPlaylist()}>{children}</Context.Provider>;
}

export const useCurrenPlaylistContext = () => {
  const context = useContext(Context);
  if (!context) throw new Error("");

  return context;
};

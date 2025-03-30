import { createContext, ReactNode, useContext, useState } from "react";

function useSinger() {
  const [singer, setSinger] = useState<Singer>();

  const [isFetching, setIsFetching] = useState(true);

  const [songs, setSongs] = useState<Song[]>([]);

  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [albums, setAlbums] = useState<Playlist[]>([]);

  return {
    singer,
    setSinger,
    isFetching,
    setIsFetching,
    songs,
    setSongs,
    playlists,
    albums,
    setAlbums,
    setPlaylists,
  };
}

type ContextType = ReturnType<typeof useSinger>;

const Context = createContext<ContextType | null>(null);

export default function SingerProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useSinger()}>{children}</Context.Provider>;
}

export function useSingerContext() {
  const ct = useContext(Context);
  if (!ct) throw new Error("SingerProvider not provided");

  return ct;
}

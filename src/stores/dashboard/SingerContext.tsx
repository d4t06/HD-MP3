import { createContext, ReactNode, useContext, useState } from "react";

function useSinger() {
  const [singers, setSingers] = useState<Singer[]>([]);
  
  const [singer, setSinger] = useState<Singer>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  return {
    singer,
    setSinger,
    singers,
    setSingers,
    songs,
    setSongs,
    playlists,
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

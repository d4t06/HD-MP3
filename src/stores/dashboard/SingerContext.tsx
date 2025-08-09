import { QueryDocumentSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useContext, useRef, useState } from "react";

const PAGE_SIZE = 6;

function useSinger() {
  const [singers, setSingers] = useState<Singer[]>([]);

  const [singer, setSinger] = useState<Singer>();
  const [songs, setSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [albums, setAlbums] = useState<Playlist[]>([]);

  const [hasMore, setHasMore] = useState(true);

  const lastDoc = useRef<QueryDocumentSnapshot>();
  const shouldGetSingers = useRef(true);

  return {
    singer,
    setSinger,
    singers,
    setSingers,
    songs,
    setSongs,
    playlists,
    setPlaylists,
    albums,
    setAlbums,
    hasMore,
    setHasMore,
    lastDoc,
    shouldGetSingers,
    PAGE_SIZE,
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

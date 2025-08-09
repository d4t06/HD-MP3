import { QueryDocumentSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

const PAGE_SIZE = 6

function usePlaylists() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [hasMore, setHasMore] = useState(true);

  const lastDoc = useRef<QueryDocumentSnapshot>();

  const shouldGetPlaylists = useRef(true);

  return {
    playlists,
    setPlaylists,
    shouldGetPlaylists,
    lastDoc,
    hasMore,
    setHasMore,
    PAGE_SIZE
  };
}

type ContextType = ReturnType<typeof usePlaylists>;

const Context = createContext<ContextType | null>(null);

export default function PlaylistsProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <Context.Provider value={usePlaylists()}>{children}</Context.Provider>;
}

export const usePlaylistsContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("PlaylistProvider not provided");
  return ct;
};

import { QueryDocumentSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

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

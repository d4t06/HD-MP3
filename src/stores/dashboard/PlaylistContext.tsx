import { QueryDocumentSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

function usePlaylist() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const [playlist, setPlaylist] = useState<Playlist>();

  const [imageFile, setImageFile] = useState<File>();
  const [songs, setSongs] = useState<Song[]>([]);

  const [hasMore, setHasMore] = useState(true);

  const lastDoc = useRef<QueryDocumentSnapshot>();
  const shouldGetPlaylists = useRef(true);

  const updatePlaylistData = (data?: Partial<PlaylistSchema>) => {
    if (!playlist) return;
    setPlaylist({ ...playlist, ...data });
  };

  return {
    imageFile,
    setImageFile,
    playlist,
    setPlaylist,
    playlists,
    setPlaylists,
    songs,
    setSongs,
    updatePlaylistData,
    shouldGetPlaylists,
    lastDoc,
    hasMore,
    setHasMore,
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

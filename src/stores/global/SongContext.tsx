import { QueryDocumentSnapshot } from "firebase/firestore";
import { ReactNode, createContext, useContext, useRef, useState } from "react";

function useSong() {
  const [sysSongPlaylist, setSysSongPlaylist] = useState<{
    songs: Song[];
    playlists: Playlist[];
  }>({ songs: [], playlists: [] });
  const [genres, setGenres] = useState<Genre[]>([]);

  const [uploadedSongs, setUploadedSongs] = useState<Song[]>([]);
  const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [singers, setSingers] = useState<Singer[]>([]);
  const [hasMore, setHasMore] = useState(true);

  //   const ranGetSong = useRef(false);
  const shouldFetchUserSongs = useRef(true);
  const shouldFetchFavoriteSongs = useRef(true);
  const shouldFetchUserPlaylists = useRef(true);
  const shouldFetchUserSingers = useRef(true);
  const lastDoc = useRef<QueryDocumentSnapshot>();
  const checkEntireUser = useRef(false); // for useMySongPage

  const updateSong = (props: { song: Partial<Song>; id: string }) => {
    const newSongs = [...uploadedSongs];
    const index = newSongs.findIndex((s) => s.id === props.id);

    if (index !== -1) {
      const newSong = { ...newSongs[index] };
      Object.assign(newSong, props.song);
      newSongs[index] = newSong;

      setUploadedSongs(newSongs);
    }
  };

  return {
    uploadedSongs,
    setUploadedSongs,
    playlists,
    setPlaylists,
    favoriteSongs,
    setFavoriteSongs,
    sysSongPlaylist,
    setSysSongPlaylist,
    shouldFetchUserSongs,
    shouldFetchUserPlaylists,
    shouldFetchFavoriteSongs,
    updateSong,
    singers,
    setSingers,
    shouldFetchUserSingers,
    lastDoc,
    hasMore,
    setHasMore,
    checkEntireUser,
    genres,
    setGenres,
  };
}

type ContextType = ReturnType<typeof useSong>;

const Context = createContext<ContextType | null>(null);

export default function SongProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useSong()}>{children}</Context.Provider>;
}

export const useSongContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("SongContext not provided");

  return ct;
};

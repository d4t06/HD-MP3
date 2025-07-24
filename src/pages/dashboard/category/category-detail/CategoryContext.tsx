import { createContext, ReactNode, useContext, useMemo, useState } from "react";

function useCategory() {
  const [category, setCategory] = useState<Category>();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  const playlistIds = useMemo(
    () => (category?.playlist_ids ? category.playlist_ids.split("_") : []),
    [category],
  );
  const orderedPlaylists = useMemo(() => {
    const bucket: Playlist[] = [];

    playlistIds.forEach((id) => {
      const founded = playlists.find((p) => p.id === id);

      if (founded) bucket.push(founded);
    });

    return bucket;
  }, [playlistIds, playlists]);

  return {
    category,
    setCategory,
    playlists,
    setPlaylists,
    songs,
    setSongs,
    orderedPlaylists,
    playlistIds,
  };
}

type ContextType = ReturnType<typeof useCategory>;

const Context = createContext<ContextType | null>(null);

export default function CategoryProvider({
  children,
}: {
  children: ReactNode;
}) {
  return <Context.Provider value={useCategory()}>{children}</Context.Provider>;
}

export const useCategoryContext = () => {
  const ct = useContext(Context);

  if (!ct) throw new Error("CategoryProvider is not provided");

  return ct;
};

import { ReactNode, createContext, useContext, useState } from "react";

const useSelectPlaylist = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedPlaylists, setSelectedPlaylists] = useState<Playlist[]>([]);

  const selectSong = (playlist: Playlist) => {
    const newSongs = [...selectedPlaylists];
    const index = newSongs.findIndex((s) => s.id === playlist.id);

    if (index === -1) newSongs.push(playlist);
    else newSongs.splice(index, 1);

    setIsChecked(!!newSongs.length);
    setSelectedPlaylists(newSongs);
  };

  const selectAllPlaylist = (playlists: Playlist[]) => {
    setIsChecked(true);
    setIsSelectAll(true);
    setSelectedPlaylists(playlists);
  };

  const resetSelect = () => {
    setIsChecked(false);
    setIsSelectAll(false);
    setSelectedPlaylists([]);
  };

  return {
    isChecked,
    setIsChecked,
    isSelectAll,
    setIsSelectAll,
    setSelectedPlaylists,
    selectedPlaylists,
    selectAllPlaylist,
    selectSong,
    resetSelect,
  };
};

type ContextType = ReturnType<typeof useSelectPlaylist>;

const context = createContext<ContextType | null>(null);

export default function PlaylistSelectProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <context.Provider value={useSelectPlaylist()}>
      {children}
    </context.Provider>
  );
}

export const usePlaylistSelectContext = () => {
  const ct = useContext(context);
  if (!ct) throw new Error("PlaylistSelectProvider not provided");
  return ct;
};

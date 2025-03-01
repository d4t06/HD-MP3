import { ReactNode, createContext, useContext, useState } from "react";

const useSelectSong = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  const selectSong = (song: Song) => {
    const newSongs = [...selectedSongs];
    const index = newSongs.findIndex((s) => s.id === song.id);

    if (index === -1) newSongs.push(song);
    else newSongs.splice(index, 1);

    setIsChecked(!!newSongs.length);
    setSelectedSongs(newSongs);
  };

  const selectAllSong = (songs: Song[]) => {
    setIsChecked(true);
    setIsSelectAll(true);
    setSelectedSongs(songs);
  };

  const resetSelect = () => {
    setIsChecked(false);
    setIsSelectAll(false);
    setSelectedSongs([]);
  };

  return {
    isChecked,
    setIsChecked,
    isSelectAll,
    setIsSelectAll,
    setSelectedSongs,
    selectedSongs,
    selectAllSong,
    selectSong,
    resetSelect,
  };
};

type ContextType = ReturnType<typeof useSelectSong>;

const SongSelectContext = createContext<ContextType | null>(null);

export default function SongSelectProvider({ children }: { children: ReactNode }) {
  return (
    <SongSelectContext.Provider value={useSelectSong()}>
      {children}
    </SongSelectContext.Provider>
  );
}

export const useSongSelectContext = () => {
  const ct = useContext(SongSelectContext);
  if (!ct) throw new Error("SelectSongContext not provided");
  return ct;
};

import { ReactNode, createContext, useContext, useState } from "react";

function useAddSong() {
  const [songFile, setSongFile] = useState<File>();
  const [songData, setSongData] = useState<SongSchema>();
  const [singers, setSingers] = useState<Singer[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [ableToSubmit, setAbleToSubmit] = useState(false);

  // const ableToSubmit = !!songFile && singers.length && genres.length;

  const selectSinger = (singer: Singer) => {
    const newSingers = [...singers];
    const index = newSingers.findIndex((s) => s.id === singer.id);

    if (index === -1) newSingers.push(singer);
    else newSingers.splice(index, 1);

    setSingers(newSingers);
  };

  const selectGenre = (genre: Genre) => {
    const newGenres = [...genres];
    const index = newGenres.findIndex((g) => g.id === genre.id);

    if (index === -1) newGenres.push(genre);
    else newGenres.splice(index, 1);

    setGenres(newGenres);
  };

  const updateSongData = (data?: Partial<SongSchema>) => {
    if (!songData) return;
    setSongData({ ...songData, ...data });
  };

  const resetAddSongContext = () => {
    setSongFile(undefined);
    setSongData(undefined);
    setSingers([]);
    setGenres([]);
  };

  return {
    songFile,
    setSongFile,
    songData,
    setSongData,
    updateSongData,
    singers,
    genres,
    selectGenre,
    selectSinger,
    ableToSubmit,
    setAbleToSubmit,
    resetAddSongContext,
  };
}

type ContextType = ReturnType<typeof useAddSong>;

const Context = createContext<ContextType | null>(null);

export default function AddSongProvider({ children }: { children: ReactNode }) {
  return <Context.Provider value={useAddSong()}>{children}</Context.Provider>;
}

export const useAddSongContext = () => {
  const ct = useContext(Context);
  if (!ct) throw new Error("AddSongProvider not provided");
  return ct;
};

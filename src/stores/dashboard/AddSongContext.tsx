import { ReactNode, createContext, useContext, useRef, useState } from "react";

function useAddSong() {
  const [songFile, setSongFile] = useState<File>();
  const [songData, setSongData] = useState<SongSchema>();
  const [singers, setSingers] = useState<Singer[]>([]);
  const [mainGenre, setMainGenre] = useState<Genre>();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [imageFile, setImageFile] = useState<File>();
  const [song, setSong] = useState<Song>();
  const [imageBlob, setImageBlob] = useState<Blob>();
  // const [imageSize, setImageSize] = useState("");
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const variant = useRef<"add" | "edit">("add");

  const audioRef = useRef<HTMLAudioElement>(null);

  const selectSinger = (singer: Singer) => {
    const newSingers = [...singers];
    const index = newSingers.findIndex((s) => s.id === singer.id);

    if (index === -1) newSingers.push(singer);
    else newSingers.splice(index, 1);

    setSingers(newSingers);
  };

  const removePlaylist = (index: number) => {
    const newPlaylists = [...playlists];
    newPlaylists.splice(index, 1);

    setPlaylists(newPlaylists);
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
    setSingers([]);
    setGenres([]);
  };

  return {
    imageFile,
    setImageFile,
    songFile,
    setSongFile,
    songData,
    song,
    setSong,
    variant,
    setSongData,
    updateSongData,
    singers,
    setSingers,
    setGenres,
    genres,
    selectGenre,
    selectSinger,
    imageBlob,
    setImageBlob,
    resetAddSongContext,
    audioRef,
    mainGenre,
    setMainGenre,
    // imageSize,
    // setImageSize,
    playlists,
    setPlaylists,
    removePlaylist,
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

import axios from "axios";

const isDev: boolean = import.meta.env.DEV;

const STORAGE_KEY = isDev ? "HD-MP3_DEV" : "HD-MP3";

export const request = axios.create({
  baseURL: import.meta.env.VITE_ENDPOINT || "https://express-zingmp3-awx6.vercel.app",
});

export const getLocalStorage = () =>
  JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") as Record<string, any>;

export const setLocalStorage = (key: string, value: any) => {
  const storage = getLocalStorage();
  storage[key] = value;

  return localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.round(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export const updateSongsListValue = (song: Song, songList: Song[]) => {
  if (isDev) console.log("update songs list");

  const index = songList.findIndex((s) => {
    return s.id === song.id;
  });

  if (index == -1) return;
  songList[index] = song;
  return index;
};

export const updatePlaylistsValue = (playlist: Playlist, playlists: Playlist[]) => {
  if (isDev) console.log("update playlist value");

  const index = playlists.findIndex((playlistItem) => playlistItem.id === playlist.id);
  if (index == -1) return;
  playlists[index] = playlist;
};

export const sleep = async (delay: number) => new Promise((rs) => setTimeout(rs, delay));

export const scrollIntoView = (el: Element, behavior?: ScrollOptions["behavior"]) => {
  el.scrollIntoView({
    behavior: behavior || "smooth",
    block: "center",
  });
};

export const getDisable = (v: boolean) => (v ? "disable" : "");
export const getHidden = (v: boolean) => (v ? "hidden" : "");
export const getClasses = (v: boolean, classes?: string) => (v ? classes : "");

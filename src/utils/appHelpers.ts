import axios from "axios";
import { Timestamp } from "firebase/firestore";

const isDev: boolean = import.meta.env.DEV;

const STORAGE_KEY = isDev ? "HD-MP3_DEV" : "HD-MP3";

export const convertToEn = (name: string): string => {
  const convert = (str: string) => {
    const newString = str
      .toLocaleLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ắ|ằ|ẳ|ẵ|ặ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ý|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d");
    return newString;
  };
  return convert(name);
};

export const request = axios.create({
  baseURL: import.meta.env.DEV
    ? import.meta.env.VITE_API_ENDPOINT ||
      "https://express-zingmp3-production.up.railway.app/api"
    : "https://express-zingmp3-production.up.railway.app/api",
});

// "https://express-zingmp3.on.shiper.app/api"
// "https://express-zingmp3-production.up.railway.app/api"

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

export const updatePlaylistsValue = (
  playlist: Playlist,
  playlists: Playlist[],
) => {
  if (isDev) console.log("update playlist value");

  const index = playlists.findIndex(
    (playlistItem) => playlistItem.id === playlist.id,
  );
  if (index == -1) return;
  playlists[index] = playlist;
};

export const sleep = async (delay: number) =>
  new Promise((rs) => setTimeout(rs, delay));

export const scrollIntoView = (
  el: Element,
  behavior?: ScrollOptions["behavior"],
) => {
  el.scrollIntoView({
    behavior: behavior || "smooth",
    block: "center",
  });
};

export const getDisable = (v: boolean) => (v ? "disable" : "");
export const getHidden = (v: boolean) => (v ? "hidden" : "");
export const getClasses = (v: boolean, classes?: string) => (v ? classes : "");

export const formatSize = (size: number) => {
  const units = ["Kb", "Mb"];
  let mb = 0;

  if (size < 1024) return size.toFixed(0) + units[mb];
  while (size > 1024) {
    size -= 1024;
    mb++;
  }

  return mb + "," + size.toFixed(1) + units[1];
};

export const getToDayTimestamp = (times: number[]) => {
  const now = new Date();

  const date = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    ...times,
  );

  return Timestamp.fromDate(date);
};

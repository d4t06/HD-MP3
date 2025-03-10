import { Timestamp } from "firebase/firestore";
import { nanoid } from "nanoid";
import axios from "axios";

const isDev: boolean = import.meta.env.DEV;

export const request = axios.create({
  baseURL: import.meta.env.VITE_ENDPOINT || "https://express-zingmp3-awx6.vercel.app",
});

export const convertTimestampToString = (timeStamp: Timestamp) => {
  return new Date(timeStamp.toDate().getTime()).toLocaleString();
};

export const getLocalStorage = () =>
  JSON.parse(localStorage.getItem("HD-MP3") || "{}") as Record<string, any>;

export const setLocalStorage = (key: string, value: any) => {
  const storage = getLocalStorage();
  storage[key] = value;

  return localStorage.setItem("HD-MP3", JSON.stringify(storage));
};

export const generateId = (name: string): string => {
  const convertToEn = (str: string) => {
    const newString = str
      .toLocaleLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ/g, "a")
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e")
      .replace(/ì|í|ị|ỉ|ĩ/g, "i")
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o")
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u")
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y")
      .replace(/đ/g, "d");
    return newString;
  };
  return convertToEn(name).toLocaleLowerCase().replaceAll(/[\W_]/g, "") + "_" + nanoid(4);
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

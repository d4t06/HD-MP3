import { Timestamp } from "firebase/firestore";
import { Playlist, Song } from "../types";
import { fromFile } from "id3js";
import { nanoid } from "nanoid";
export const convertTimestampToString = (timeStamp: Timestamp) => {
   return new Date(timeStamp.toDate().getTime()).toLocaleString();
};

export const generateId = (name: string): string => {
   // Replace all Vietnamese accent characters with their corresponding non-accented characters.
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

type ParserSong = {
   name: string;
   singer: string;
   image: ArrayBuffer | null;
};
export const parserSong = async (songFile: File) => {
   if (!songFile) return;
   const tags = await fromFile(songFile);
   if (!tags) return;

   const { title, artist, images } = tags;
   const data: ParserSong = { name: "", singer: "", image: null };

   if (!title || !artist) {
      console.log("song don't have tags");
   }

   data.name = title || songFile.name;
   data.singer = artist || "...";

   if (images.length) {
      data.image = images[0].data;
   }

   return data;
};

export const getBlurhashEncode = async (blob: Blob) => {
   console.log("get blurHash encode");

   const res = await fetch("https://express-zingmp3.onrender.com/api/image/encode", {
      method: "post",
      body: blob,
   });
   let encode;
   if (res.ok) {
      const data = (await res.json()) as { encode: string };
      if (data) encode = data.encode;
   }
   return { encode };
};

export const handleTimeText = (duration: number) => {
   if (!duration) return "";

   let minute = 0;
   let fixedDuration = +duration.toFixed(0);
   while (fixedDuration >= 60) {
      fixedDuration -= 60;
      minute++;
   }

   if (minute < 10) {
      if (fixedDuration >= 10) {
         return `0${minute}:${fixedDuration}`;
      }
      return `0${minute}:0${fixedDuration}`;
   } else {
      if (fixedDuration >= 10) {
         return `${minute}:${fixedDuration}`;
      }
      return `${minute}:0${fixedDuration}`;
   }
};

export const updateSongsListValue = (song: Song, userSongs: Song[]) => {
   console.log("update songs list");

   const index = userSongs.findIndex((songItem) => {
      // console.log(songItem.id, "===", song.id, songItem.id === song.id);
      return songItem.id === song.id;
   });
   
   if (index == -1) return;
   userSongs[index] = song;
   return index;
};

export const updatePlaylistsValue = (playlist: Playlist, playlists: Playlist[]) => {
   console.log("update playlist value");

   const index = playlists.findIndex((playlistItem) => playlistItem.id === playlist.id);
   if (index == -1) return;
   playlists[index] = playlist;
};

export const countSongsListTimeIds = (songsList: Song[]): { time: number; ids: string[] } => {
   let time: number = 0;
   let ids: string[] = [];

   songsList.forEach((song) => {
      time += song.duration;
      ids.push(song.id);
   });

   return { time, ids };
};

export const generatePlaylistAfterChangeSongs = ({
   newPlaylistSongs,
   existingPlaylist,
}: {
   newPlaylistSongs: Song[];
   existingPlaylist: Playlist;
}) => {
   console.log("generate playlist");
   const { ids, time } = countSongsListTimeIds(newPlaylistSongs);
   const newPlaylist: Playlist = {
      ...existingPlaylist,
      time: +time.toFixed(1),
      song_ids: ids,
      count: ids.length,
   };

   return newPlaylist;
};

export const generatePlaylistAfterChangeSong = ({
   song,
   playlist,
}: {
   song: Song;
   playlist: Playlist;
}) => {
   console.log("generate playlist");

   const newPlaylist: Playlist = {
      ...playlist,
      time: +(playlist.time + song.duration).toFixed(1),
      song_ids: [...playlist.song_ids, song.id],
      count: playlist.count + 1,
   };

   return newPlaylist;
};

export const initSongObject = ({ ...value }: Partial<Song>) => {
   const song: Song = {
      name: "",
      singer: "",
      image_url: "",
      song_url: "",
      by: "",
      duration: 0,
      lyric_id: "",
      image_file_path: "",
      song_file_path: "",
      id: "",
      in_playlist: [],
      blurhash_encode: "",
   };
   return {
      ...song,
      ...value,
   } as Song;
};

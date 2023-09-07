import { Song } from "../types";

export const generateSongId = (song: Song): string => {
   const nameAndSinger = song.name.replaceAll(/[\W_]/g, '') + "_" + song.singer.replaceAll(/[\W_]/g, '')
   return nameAndSinger.toLocaleLowerCase()
}



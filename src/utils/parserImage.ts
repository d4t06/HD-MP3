import { ParserSong } from "../types";
import parse from "id3-parser";
// import { parseFile } from 'music-metadata';
import { convertFileToBuffer } from 'id3-parser/lib/util';



export const parserImageFile = async (songFile: File) => {

   if (!songFile) return;
   const tags = await convertFileToBuffer(songFile).then(parse)

   
   if (!tags) return;
   // console.log('check song tags', tags)

   const { title, artist, lyrics } = tags
   const data: ParserSong = { name: '', singer: '', lyric: '' }

   if (!title || !artist) {
      console.log("song don't have tags")
   }

   data.name = title || songFile.name;
   data.singer = artist || '...';

   if (lyrics?.length) {
      const songLyric = lyrics[0].value

      if (!songLyric) data.lyric = '';
      else if (songLyric.includes('image/jpeg')) {
         data.lyric = ''
      }
      else data.lyric = songLyric

   }

   return data;
};

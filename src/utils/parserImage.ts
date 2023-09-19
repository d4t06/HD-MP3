import { ParserSong } from "../types";
import parse from "id3-parser";
// import { parseFile } from 'music-metadata';
import { convertFileToBuffer } from 'id3-parser/lib/util';



export const parserImageFile = async (songFile: File) => {

   if (!songFile) return;
   const tags = await convertFileToBuffer(songFile).then(parse)

   console.log('check song data', tags)

   if (!tags) return;
   // console.log("check tag", tags);

   const { title, artist, lyrics } = tags
   const data: ParserSong = { name: '', singer: '', lyric: '' }

   if (!title || !artist) return;

   data.name = title;
   data.singer = artist;

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

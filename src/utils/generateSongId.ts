import { Song } from "../types";

export const generateSongId = (song: Song): string => {

   // Replace all Vietnamese accent characters with their corresponding non-accented characters.
   const constvertToEn = (str: string) => {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      return str;
   }
   const name = constvertToEn(song.name)
   const singer = constvertToEn(song.singer)
   const nameAndSinger = name.replaceAll(/[\W_]/g, '') + "_" + singer.replaceAll(/[\W_]/g, '')
   return nameAndSinger.toLocaleLowerCase()
}



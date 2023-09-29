
import { Timestamp } from "firebase/firestore";

export const convertTimestampToString = (timeStamp : Timestamp) => {
   return new Date(timeStamp.toDate().getTime()).toLocaleString();
}

export const generateId = (name: string, email: string): string => {

   // Replace all Vietnamese accent characters with their corresponding non-accented characters.
   const convertToEn = (str: string) => {
      str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ/g, "a");
      str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
      str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
      str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ/g, "o");
      str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
      str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
      str = str.replace(/đ/g, "d");
      return str;
   }
   return convertToEn(name).toLocaleLowerCase().replaceAll(/[\W_]/g, '') + '_' + email.replace('@gmail.com', '')
}

export const handleTimeText = (duration: number) => {
   if (!duration) return '';

   let minute = 0;
   let fixexDuration = +duration.toFixed(0);
   while (fixexDuration >= 60) {
      fixexDuration -= 60;
      minute++;
   }

   if (minute < 10) {
      if (fixexDuration >= 10) {
         return `0${minute}:${fixexDuration}`;
      }
      return `0${minute}:0${fixexDuration}`;
   } else {
      if (fixexDuration >= 10) {
         return `${minute}:${fixexDuration}`;
      }
      return `${minute}:0${fixexDuration}`;
   }


};
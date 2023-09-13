import { Timestamp } from "firebase/firestore";

export const convertTimestampToString = (timeStamp : Timestamp) => {
   return new Date(timeStamp.toDate().getTime()).toLocaleString();
}
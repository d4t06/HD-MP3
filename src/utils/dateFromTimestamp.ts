import { Timestamp } from "firebase/firestore";

// British English uses day-month-year order
export const dateFromTimestamp = (
  timeStamp: Timestamp,
  opts?: { type: "date" | "time" },
) => {
  if (!timeStamp?.seconds || !timeStamp?.seconds) return "";
  if (opts?.type === "date")
    return new Date(timeStamp?.toDate()).toLocaleDateString("en-GB");

  return new Date(timeStamp?.toDate()).toLocaleString();
};

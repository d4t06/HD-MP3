import { query, where } from "firebase/firestore";
import { songsCollectionRef } from "./firebaseService";
import { implementSongQuery } from "./appService";

export async function getRelativeSongs(song: Song) {
  if (!song.main_genre?.id || !song.genre_ids || !song.release_year) return [];

  const q = query(
    songsCollectionRef,
    where("main_genre.id", "==", song.main_genre?.id),
    where("genre_ids", "array-contains-any", song.genre_ids),
    where("release_year", ">=", song.release_year - 1),
    where("release_year", "<=", song.release_year + 1),
  );

  const result = await implementSongQuery(q, { msg: "Get relative songs" });
  const relativeSongs = result.filter((s) => s.id !== song.id);

  return relativeSongs;
}

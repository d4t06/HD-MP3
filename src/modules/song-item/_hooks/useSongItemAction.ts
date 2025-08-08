import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { useState } from "react";

import { deleteSongFiles } from "@/services/firebaseService";
import { doc, increment, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";

export default function useSongItemAction() {
  // stores
  const { user, updateUserData } = useAuthContext();
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { uploadedSongs, setUploadedSongs, shouldFetchFavoriteSongs } =
    useSongContext();

  // state
  const [loading, setLoading] = useState(false);

  type DeleteSong = {
    song: Song;
    variant: "delete";
  };

  type LikedSong = {
    song: Song;
    variant: "like";
  };

  const action = async (props: DeleteSong | LikedSong) => {
    try {
      setLoading(true);
      if (!user) throw new Error("User not found");
      const batch = writeBatch(db);

      const userRef = doc(db, "Users", user.email);
      const songRef = doc(db, "Songs", props.song.id);

      switch (props.variant) {
        case "delete": {
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          const newUserData: Partial<User> = {
            liked_song_ids: user.liked_song_ids.filter(
              (id) => id !== props.song.id,
            ),
          };

          // update user data
          batch.update(userRef, newUserData);
          // delete song doc
          batch.delete(songRef);
          // delete lyric
          if (props.song.lyric_id) {
            const lyricRef = doc(db, "Lyrics", props.song.lyric_id);
            batch.delete(lyricRef);
          }

          await Promise.all([batch.commit(), deleteSongFiles(props.song)]);

          setUploadedSongs(newSongs);
          setSuccessToast(`'${props.song.name}' deleted`);

          if (user.liked_song_ids.includes(props.song.id))
            shouldFetchFavoriteSongs.current = true;

          break;
        }

        case "like": {
          if (!user) return;

          const newLikedSongIds = [...user.liked_song_ids];
          const index = newLikedSongIds.findIndex((id) => id === props.song.id);

          const isLike = index === -1;

          if (isLike) newLikedSongIds.unshift(props.song.id);
          else newLikedSongIds.splice(index, 1);

          const newUserData: Partial<User> = {
            liked_song_ids: newLikedSongIds,
          };

          const newSongData = {
            like: increment(isLike ? 1 : -1),
          };

          batch.update(userRef, newUserData);
          batch.update(songRef, newSongData);

          await batch.commit();

          updateUserData(newUserData);

          // refetch
          shouldFetchFavoriteSongs.current = true;

          break;
        }
      }
    } catch (error) {
      console.log({ message: error });
      setErrorToast();
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    action,
  };
}

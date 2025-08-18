import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { useState } from "react";

import { deleteSongFiles } from "@/services/firebaseService";
import { doc, increment, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";
import useGetMyMusicSong from "@/pages/my-music/_hooks/useGetMyMusicSong";

export default function useSongItemAction() {
  // stores
  const { user, updateUserData } = useAuthContext();
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { uploadedSongs, setUploadedSongs, setFavoriteSongs } =
    useSongContext();

  // state
  const [loading, setLoading] = useState(false);

  const { getSongs } = useGetMyMusicSong({
    tab: "favorite",
  });

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

      const userFavoriteSongs = (await getSongs()) as Song[];

      const index = userFavoriteSongs.findIndex((s) => s.id === props.song.id);
      const isLiked = index !== -1;

      switch (props.variant) {
        case "delete": {
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          // delete song doc
          batch.delete(songRef);
          // delete lyric
          if (props.song.lyric_id) {
            const lyricRef = doc(db, "Lyrics", props.song.lyric_id);
            batch.delete(lyricRef);
          }

          if (isLiked) {
            userFavoriteSongs.splice(index, 1);

            const newUserData: Partial<User> = {
              liked_song_ids: userFavoriteSongs.map((s) => s.id),
            };

            batch.update(userRef, newUserData);

            setFavoriteSongs(userFavoriteSongs);
            updateUserData(newUserData);
          }

          await Promise.all([batch.commit(), deleteSongFiles(props.song)]);

          setUploadedSongs(newSongs);
          setSuccessToast(`'${props.song.name}' deleted`);

          break;
        }

        case "like": {
          if (!user) return;

          if (isLiked) {
            userFavoriteSongs.splice(index, 1);
          } else {
            userFavoriteSongs.unshift(props.song);
          }
          const newUserData: Partial<User> = {
            liked_song_ids: userFavoriteSongs.map((s) => s.id),
          };

          const newSongData = {
            like: increment(isLiked ? -1 : +1),
          };

          batch.update(userRef, newUserData);
          batch.update(songRef, newSongData);

          await batch.commit();

          setFavoriteSongs(userFavoriteSongs);
          updateUserData(newUserData);

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

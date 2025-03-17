import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { useState } from "react";

import { deleteSong, myUpdateDoc } from "@/services/firebaseService";

export default function useSongItemAction() {
  // stores
  const { user, updateUserData } = useAuthContext();
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { uploadedSongs, setUploadedSongs, shouldFetchFavoriteSongs } = useSongContext();

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

      switch (props.variant) {
        case "delete": {
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          await deleteSong(props.song);
          setUploadedSongs(newSongs);

          setSuccessToast(`'${props.song.name}' deleted`);

          break;
        }

        case "like": {
          if (!user) return;

          const newLikedSongIds = [...user.liked_song_ids];
          const index = newLikedSongIds.findIndex((id) => id === props.song.id);

          if (index === -1) newLikedSongIds.unshift(props.song.id);
          else newLikedSongIds.splice(index, 1);

          const newUserData: Partial<User> = {
            liked_song_ids: newLikedSongIds,
          };

          await myUpdateDoc({
            collectionName: "Users",
            data: newUserData,
            id: user.email,
          });

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

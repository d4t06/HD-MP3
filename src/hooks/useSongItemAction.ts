import { useSongContext, useToastContext } from "@/stores";
import { useState } from "react";

import { deleteSong } from "@/services/firebaseService";

export default function useSongItemAction() {
  // stores
  const { setErrorToast, setSuccessToast } = useToastContext();
  const { uploadedSongs, setUploadedSongs } = useSongContext();

  // state
  const [loading, setLoading] = useState(false);

  type DeleteSong = {
    song: Song;
    variant: "delete";
  };

  const action = async (props: DeleteSong) => {
    try {
      setLoading(true);

      switch (props.variant) {
        case "delete":
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          await deleteSong(props.song);
          setUploadedSongs(newSongs);

          setSuccessToast(`'${props.song.name}' deleted`);

          break;
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

import { useSongContext } from "@/store/SongsContext";
import { useState } from "react";
import { useToast } from "../store";

// import usePlaylistActions from "./usePlaylistActions";
import { deleteSong } from "@/services/firebaseService";

export default function useSongItemActions() {
  // store
  const { setErrorToast, setSuccessToast } = useToast();
  const { songs, setSongs } = useSongContext();

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
          const newSongs = songs.filter((s) => s.id !== props.song.id);

          await deleteSong(props.song);
          setSongs(newSongs);

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

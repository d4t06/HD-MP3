import { db } from "@/firebase";
import { deleteSongFiles } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { doc, writeBatch } from "firebase/firestore";
import { useState } from "react";

type DeleteSong = {
  variant: "delete";
  song: Song;
};

export type SongItemActionProps = DeleteSong;

export default function useDashboardSongItemAction() {
  const { setUploadedSongs, uploadedSongs } = useSongContext();

  const [isFetching, setIsFetching] = useState(false);

  const { setSuccessToast, setErrorToast } = useToastContext();

  const actions = async (props: SongItemActionProps) => {
    try {
      setIsFetching(true);

      const batch = writeBatch(db);
      const songRef = doc(db, "Songs", props.song.id);

      switch (props.variant) {
        case "delete": {
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          batch.delete(songRef);
          if (props.song.lyric_id) {
            const lyricRef = doc(db, "Lyrics", props.song.lyric_id);
            batch.delete(lyricRef);
          }

          await Promise.all([batch.commit(), deleteSongFiles(props.song)]);

          // await deleteSong(props.song);
          setUploadedSongs(newSongs);

          setSuccessToast(`'${props.song.name}' deleted`);

          break;
        }
      }
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { actions, isFetching };
}

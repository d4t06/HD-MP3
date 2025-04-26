import { db } from "@/firebase";
import { commentCollectionRef, deleteSongFiles } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { doc, getDocs, query, where, writeBatch } from "firebase/firestore";
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

      const commentSnap = await getDocs(
        query(commentCollectionRef, where("target_id", "==", props.song.id)),
      );

      switch (props.variant) {
        case "delete": {
          const newSongs = uploadedSongs.filter((s) => s.id !== props.song.id);

          // delete song doc
          batch.delete(songRef);

          // delete song lyric
          if (props.song.lyric_id) {
            const lyricRef = doc(db, "Lyrics", props.song.lyric_id);
            batch.delete(lyricRef);
          }

          // delete comments
           if (!commentSnap.empty) {
            console.log(`Delete ${commentSnap.docs.length} comments`);
            commentSnap.forEach((snap) => batch.delete(snap.ref));
          }

          await Promise.all([batch.commit(), deleteSongFiles(props.song)]);

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

import { optimizeAndGetHashImage } from "@/services/appService";
import { myAddDoc } from "@/services/firebaseService";
import { useSongContext, useToastContext } from "@/stores";
import { getDoc } from "firebase/firestore";
import { useState } from "react";

export default function useAddPlaylist() {
  const { setPlaylists } = useSongContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const handleAddPlaylist = async (playlist: PlaylistSchema, imageFile?: File) => {
    try {
      setIsFetching(true);

      if (imageFile) {
        const imageData = await optimizeAndGetHashImage(imageFile);
        Object.assign(playlist, imageData);
      }

      const docRef = await myAddDoc({
        collectionName: "Playlists",
        data: playlist,
      });

      const newDocRef = await getDoc(docRef);

      const newPlaylist: Playlist = {
        ...(newDocRef.data() as PlaylistSchema),
        id: newDocRef.id,
      };

      setPlaylists((prev) => [newPlaylist, ...prev]);
      setSuccessToast(`Playlist created`);

      return newPlaylist;
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { isFetching, handleAddPlaylist };
}

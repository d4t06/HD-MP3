import { useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { myAddDoc, myDeleteDoc } from "@/services/firebaseService";
import { initPlaylistObject } from "@/utils/factory";
import { getDoc } from "firebase/firestore";

export default function usePlaylistAction() {
  // stores

  const { user } = useAuthContext();
  const { setPlaylists } = useSongContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const { setErrorToast } = useToastContext();

  const handleAddPlaylist = async (playlistName: string) => {
    try {
      if (!user) return;
      if (!playlistName) throw new Error("playlist name invalid");

      const addedPlaylist = initPlaylistObject({
        name: playlistName,
        owner_email: user.email,
      });

      setIsFetching(true);

      const docRef = await myAddDoc({
        collectionName: "Playlists",
        data: addedPlaylist,
        msg: ">>> api: set playlist doc",
      });

      const newPlaylistRef = await getDoc(docRef);

      setPlaylists((prev) => [
        ...prev,
        { ...newPlaylistRef.data(), id: docRef.id } as Playlist,
      ]);
    } catch (error) {
      console.log({ message: error });
      setErrorToast("");
    } finally {
      setIsFetching(false);
    }
  };

  const handleDeletePlaylist = async (id: string) => {
    setIsFetching(true);

    // >>> api
    await myDeleteDoc({
      collectionName: "Playlists",
      id: id,
      msg: ">>> api: delete playlist doc",
    });

    setIsFetching(false);
  };

  return {
    isFetching,
    handleAddPlaylist,
    handleDeletePlaylist,
  };
}

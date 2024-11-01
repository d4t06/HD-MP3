import { useState } from "react";
import { useSongsStore, useToast } from "../store";
import {
  // countSongsListTimeIds,
  generateId,
  // generatePlaylistAfterChangeSong,
  // generatePlaylistAfterChangeSongs,
  initPlaylistObject,
} from "../utils/appHelpers";
import { myDeleteDoc, mySetDoc } from "@/services/firebaseService";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetCurrentPlaylist,
  selectCurrentPlaylist,
} from "@/store/currentPlaylistSlice";

export default function useAdminPlaylistActions() {
  // store
  const dispatch = useDispatch();
  const { userPlaylists, setUserPlaylists } = useSongsStore();
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const navigate = useNavigate();
  const { setErrorToast } = useToast();

  const addAdminPlaylist = async (playlistName: string) => {
    try {
      if (!playlistName) throw new Error("playlist name invalid");

      const playlistId = generateId(playlistName) + "_admin";

      const addedPlaylist = initPlaylistObject({
        id: playlistId,
        by: "admin",
        name: playlistName,
      });

      setIsFetching(true);
      const newPlaylists = [...userPlaylists, addedPlaylist];

      await mySetDoc({
        collection: "playlist",
        data: addedPlaylist,
        id: playlistId,
        msg: ">>> api: set playlist doc",
      });

      setUserPlaylists(newPlaylists);
    } catch (error) {
      console.log({ message: error });
      setErrorToast("");
    } finally {
      setIsFetching(false);
    }
  };

  const deleteAdminPlaylist = async () => {
    if (!currentPlaylist) return;
    setIsFetching(true);

    // >>> api
    await myDeleteDoc({
      collection: "playlist",
      id: currentPlaylist.id,
      msg: ">>> api: delete playlist doc",
    });

    const newPlaylists = userPlaylists.filter((p) => p.id !== currentPlaylist.id);
    setUserPlaylists(newPlaylists);

    dispatch(resetCurrentPlaylist());

    setIsFetching(false);
    navigate("/dashboard");
  };

  return {
    isFetching,
    addAdminPlaylist,
    deleteAdminPlaylist,
  };
}

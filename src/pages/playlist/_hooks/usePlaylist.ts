import { useEffect, useRef } from "react";
import { myUpdateDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

export default function usePlaylist() {
  // use stores
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const clearPlaylistImage = useRef(false);

  const handleGetPlaylistImage = async () => {
    if (!currentPlaylist) return;

    if (currentPlaylist.image_url) {
      if (!playlistSongs[0].image_url) {
        if (!clearPlaylistImage.current) {
          clearPlaylistImage.current = true;

          return await myUpdateDoc({
            collectionName: "Playlists",
            id: currentPlaylist.id,
            data: { blurhash_encode: "", image_url: "" } as Playlist,
            msg: ">>> api: clear playlist image",
          });
        }
      }

      if (currentPlaylist.image_url === playlistSongs[0].image_url) return;
    }

    if (!playlistSongs[0].image_url) return;

    const updatePlaylistData: Partial<Playlist> = {
      image_url: playlistSongs[0].image_url,
      blurhash_encode: playlistSongs[0].blurhash_encode || "",
    };

    await myUpdateDoc({
      collectionName: "Playlists",
      id: currentPlaylist.id,
      data: updatePlaylistData,
      msg: ">>> api: update playlist image",
    });
  };

  //  update playlist image
  useEffect(() => {
    if (!playlistSongs.length || !currentPlaylist) return;

    handleGetPlaylistImage();
  }, [playlistSongs]);
}

import { useEffect } from "react";
import { mySetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";

export default function usePlaylistDetail() {
  // use store
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  // use hook

  const handleGetPlaylistImage = async () => {
    if (!currentPlaylist || !playlistSongs[0].image_url) return;
    if (currentPlaylist.image_url === playlistSongs[0].image_url) return;

    const newPlaylist: Partial<Playlist> = {
      image_url: playlistSongs[0].image_url,
      blurhash_encode: playlistSongs[0].blurhash_encode || "",
    };

    await mySetDoc({
      collection: "playlist",
      id: currentPlaylist.id,
      data: newPlaylist,
      msg: ">>> api: update playlist doc",
    });
  };

  //  update playlist image
  useEffect(() => {
    if (!playlistSongs.length || !currentPlaylist) return;

    handleGetPlaylistImage();
  }, [playlistSongs]);
}

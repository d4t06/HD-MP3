import { useEffect, useRef } from "react";
import { mySetDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";

type Props = {
  admin?: boolean; // do admin action
};

export default function usePlaylistDetail({ admin }: Props) {
  // use store
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const clearPlaylistImage = useRef(false);
  // const { updateUserPlaylist } = useSongsStore();

  // use hook

  const handleGetPlaylistImage = async () => {
    if (!currentPlaylist) return;
    if (currentPlaylist.by === "admin" && !admin) return;

    if (currentPlaylist.image_url) {
      if (!playlistSongs[0].image_url) {
        // updateUserPlaylist({
        //   id: currentPlaylist.id,
        //   playlist: { blurhash_encode: "", image_url: "" },
        // });
        if (!clearPlaylistImage.current) {
          clearPlaylistImage.current = true;

          return await mySetDoc({
            collection: "playlist",
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

    await mySetDoc({
      collection: "playlist",
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

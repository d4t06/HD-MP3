import { useEffect } from "react";
// import { myUpdateDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";

export default function usePlaylistSongList() {
  // use stores
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const handleKeyboardPress = (e: KeyboardEvent) => {
    const isLetterOrNumber = /^[a-zA-Z0-9]$/;
    if (isLetterOrNumber.test(e.key)) {
      const firstElement = document.querySelector(
        `div[data-first_letter=${
          typeof e.key === "number" ? e.key : "'" + e.key + "'"
        }]`,
      );

      if (firstElement)
        firstElement.scrollIntoView({
          block: "center",
          behavior: "instant",
        });
    }
  };

  useEffect(() => {
    if (!playlistSongs.length || !currentPlaylist) return;
    window.addEventListener("keypress", handleKeyboardPress);

    return () => {
      window.removeEventListener("keypress", handleKeyboardPress);
    };
  }, [playlistSongs, currentPlaylist]);
}

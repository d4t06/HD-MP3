import { useEffect } from "react";
// import { myUpdateDoc } from "@/services/firebaseService";
import { useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { usePageContext } from "@/stores";

export default function usePlaylistSongList() {
  // use stores
  const { playlistKeyPress } = usePageContext();
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const handleKeyboardPress = (e: KeyboardEvent) => {
    if (!playlistKeyPress.current) return;

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
    playlistKeyPress.current = true;
  }, []);

  useEffect(() => {
    if (!playlistSongs.length || !currentPlaylist) return;
    window.addEventListener("keypress", handleKeyboardPress);

    return () => {
      window.removeEventListener("keypress", handleKeyboardPress);
    };
  }, [playlistSongs, currentPlaylist]);
}

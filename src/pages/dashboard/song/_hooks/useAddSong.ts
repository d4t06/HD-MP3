import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { parserSong } from "@/utils/parseSong";
import { useEffect } from "react";

export default function useAddSong() {
  const { songFile, updateSongData } = useAddSongContext();

  const handleParseSongFile = async () => {
    if (!songFile) return;

    const payload = await parserSong(songFile);
    if (payload) {
      updateSongData({
        name: payload.name,
        singer: payload.singer,
        duration: Math.floor(payload.duration),
        size: Math.floor(songFile.size / 1024),
      });
    }
  };

  useEffect(() => {
    if (!songFile) return;

    handleParseSongFile();
  }, [songFile]);

  return { updateSongData };
}

import { convertToEn } from "@/utils/appHelpers";
import { useEditLyricContext } from "../_components/EditLyricContext";

export default function useExportLyric() {
  const { lyrics, song } = useEditLyricContext();

  const handleDownload = (content: string, type: "srt" | "json") => {
    if (!song) return;

    const blob = new Blob([content], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `lyric_${convertToEn(song.name)}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportLyric = ({ type }: { type: "json" | "srt" }) => {
    switch (type) {
      case "json":
        handleDownload(JSON.stringify(lyrics, null, 2), "json");
        break;

      case "srt": {
        let jrc = "";

        const getTime = (time: number) => {
          const minutes = Math.floor(time / 60);
          const seconds = Math.floor(time % 60);

          const mASec = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          const [_s, decimal = "0"] = time.toString().split(".");

          return `00:${mASec},${+decimal * 100}`;
        };

        lyrics.forEach((lyric, index) => {
          jrc += `${index + 1}\n${getTime(lyric.start)} --> ${getTime(lyric.end)}\n${lyric.text}\n\n`;
        });

        handleDownload(jrc, "srt");

        break;
      }
    }
  };

  return { exportLyric };
}

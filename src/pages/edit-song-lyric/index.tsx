import BackBtn from "@/components/BackBtn";
import LyricEditor from "@/modules/lyric-editor";
import { useEffect } from "react";

export default function SongLyric() {
  useEffect(() => {
    document.title = "Dmusic";
  }, []);
  return (
    <div className="fixed left-[10px] top-[10px] bottom-[10px] right-[10px] flex flex-col md:right-0 md:top-0 md:left-[unset] md:right-[unset] md:relative md:h-full md:pb-4">
      <BackBtn className="mb-1 self-start" />
      <LyricEditor />
    </div>
  );
}

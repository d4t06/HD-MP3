import LyricEditor from "@/modules/lyric-editor";
import EditLyricContextProvider from "@/stores/EditLyricContext";

export default function SongLyric() {
  return (
    <EditLyricContextProvider>
      <div className="fixed left-[10px] md:left-0 top-0 right-[10px] md:right-0 bottom-0 md:relative md:h-full">
        <LyricEditor />
      </div>
    </EditLyricContextProvider>
  );
}

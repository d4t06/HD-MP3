import LyricEditor from "@/modules/lyric-editor";
import EditLyricContextProvider from "@/stores/EditLyricContext";

export default function DashboardSongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor admin></LyricEditor>
    </EditLyricContextProvider>
  );
}

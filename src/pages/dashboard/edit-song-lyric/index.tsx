import LyricEditor from "@/modules/lyric-editor";
import EditLyricContextProvider from "@/stores/EditLyricContext";

export default function DashboardEditSongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor></LyricEditor>
    </EditLyricContextProvider>
  );
}

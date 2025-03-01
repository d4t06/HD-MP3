import LyricEditor from "@/components/LyricEditor";
import EditLyricContextProvider from "@/stores/EditLyricContext";

export default function DashboardSongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor admin></LyricEditor>
    </EditLyricContextProvider>
  );
}

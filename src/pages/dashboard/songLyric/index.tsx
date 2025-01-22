import LyricEditor from "@/components/LyricEditor";
import EditLyricContextProvider from "@/store/EditLyricContext";

export default function DashboardSongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor admin></LyricEditor>
    </EditLyricContextProvider>
  );
}

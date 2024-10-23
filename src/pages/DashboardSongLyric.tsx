import LyricEditor from "../components/LyricEditor";
import EditLyricContextProvider from "@/store/EditSongLyricContext";

export default function DashboardSongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor admin />
    </EditLyricContextProvider>
  );
}

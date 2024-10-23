import EditLyricContextProvider from "@/store/EditSongLyricContext";
import LyricEditor from "../components/LyricEditor";

export default function SongLyric() {
  return (
    <EditLyricContextProvider>
      <LyricEditor />
    </EditLyricContextProvider>
  );
}

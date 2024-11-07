import EditLyricContextProvider from "@/store/EditLyricContext";
import LyricEditor from "../components/LyricEditor";

export default function SongLyric() {
  return (
    <EditLyricContextProvider>
      <div className="fixed left-[10px] top-0 right-[10px] bottom-0 md:relative md:h-full">
        <LyricEditor />
      </div>
    </EditLyricContextProvider>
  );
}

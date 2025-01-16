import { BackBtn } from "@/components";
import LyricEditor from "@/components/LyricEditor";
import EditLyricContextProvider from "@/store/EditLyricContext";

export default function DashboardSongLyric() {
  return (
    <EditLyricContextProvider>
      
      <LyricEditor admin >
      <div className="mt-3">
        <BackBtn variant={"dashboard-playlist"} />
      </div>
      </LyricEditor>
    </EditLyricContextProvider>
  );
}

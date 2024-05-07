import { BackBtn } from "../components";
import PlaylistDetailMain from "../components/PlaylistDetailMain";
import PlaylistProvider from "../store/PlaylistSongContext";

export default function PlaylistDetail() {
   return (
      <div className="min-h-screen">
         <BackBtn />
         <PlaylistProvider>
            <PlaylistDetailMain />
         </PlaylistProvider>
      </div>
   );
}

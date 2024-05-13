import { useState } from "react";
import { SongListProvider } from "../store/SongListContext";
import CheckedBar from "./CheckedBar";
// import { useSongsStore } from "../store";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue, setQueue } from "@/store/songQueueSlice";
import { useSongsStore } from "@/store";

type Props = {
   loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
   const dispatch = useDispatch();
   const { adminSongs } = useSongsStore();
   const { from } = useSelector(selectSongQueue);
   const { currentSong } = useSelector(selectCurrentSong);
   const [isChecked, setIsChecked] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

   const handleSetSong = (song: Song, index: number) => {
      // song in playlist and song in user are two difference case
      if (currentSong.id !== song.id || currentSong.song_in !== "admin") {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));

      const isQueueHaveOtherSongs = from.length > 1 || from[0] != song.song_in;
         if (isQueueHaveOtherSongs) {
            dispatch(setQueue({ songs: adminSongs }));
         }
      }
   };

   return (
      <SongListProvider
         isChecked={isChecked}
         setIsChecked={setIsChecked}
         selectedSongs={selectedSongs}
         setSelectedSongs={setSelectedSongs}
      >
         <CheckedBar location="home" />

         {/* admin song */}
         {loading && SongItemSkeleton}

         {!loading && (
            <>
               {!!adminSongs.length ? (
                  <>
                     <SongList
                        variant="home"
                        handleSetSong={handleSetSong}
                        activeExtend={
                           currentSong.song_in === "admin" ||
                           currentSong.song_in === "favorite"
                        }
                        songs={adminSongs}
                     />
                  </>
               ) : (
                  <h1 className="text-[22px] text-center">...</h1>
               )}
            </>
         )}
      </SongListProvider>
   );
}

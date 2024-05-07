import { useState } from "react";
import { SongListProvider } from "../store/SongListContext";
import CheckedBar from "./CheckedBar";
import {
   selectAllSongStore,
   setSong,
   useActuallySongsStore,
   useSongsStore,
} from "../store";
import { SongItemSkeleton } from "./skeleton";
import { SongList } from ".";
import { useDispatch, useSelector } from "react-redux";
import { SongWithSongIn } from "../store/SongSlice";

type Props = {
   loading: boolean;
};

export default function HomeSongList({ loading }: Props) {
   const dispatch = useDispatch();
   const { adminSongs } = useSongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { setActuallySongs } = useActuallySongsStore();

   const [isChecked, setIsChecked] = useState(false);
   const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

   const handleSetSong = (song: Song, index: number) => {
      // song in playlist and song in user are two difference case
      if (songInStore.id !== song.id || songInStore.song_in !== "admin") {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));

         if (songInStore.song_in !== "admin") {
            setActuallySongs(adminSongs);
            console.log("setActuallySongs");
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
                        handleSetSong={handleSetSong}
                        activeExtend={
                           songInStore.song_in === "admin" ||
                           songInStore.song_in === "favorite"
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

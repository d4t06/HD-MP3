import { Dispatch } from "react";
// import Button from "./ui/Button";
import { useTheme } from "../store/ThemeContext";
import useUserSong from "../hooks/useUserSong";
import useAdminSong from "../hooks/useAdminSongs";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song } from "../types";

import SongListItem from "./ui/SongListItem";

type Props = {
   inList?: boolean;
   setSelectedSongs?: Dispatch<React.SetStateAction<Song[]>>;
   selectedSongs?: Song[];
};

export default function MySongsTabs({ inList, selectedSongs, setSelectedSongs }: Props) {
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);

   const { songs: userSongs } = useUserSong();

   // const [tab, setTab] = useState("all");

   // const allSong = [...userSongs, ...adminSongs].sort((songA, songB) =>
   //    songA.name.charAt(0).toLocaleLowerCase() > songB.name.charAt(0).toLocaleLowerCase()
   //       ? 1
   //       : -1
   // );

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   const setSelect = (song: Song) => {
      if (!inList) return;
      if (setSelectedSongs) {
         let tempList = [...(selectedSongs as Song[])];

         const index = tempList?.indexOf(song);

         // if no present
         if (index === -1) {
            tempList.push(song);

            // if present
         } else {
            tempList.splice(index, 1);
         }
         console.log("temp list", tempList);
         setSelectedSongs(tempList);
      }
   };

   // console.log("check selected songs", selectedSongs);

   return (
      <>
         <div className="flex flex-row flex-wrap">
            <>
               {!!userSongs.length ? (
                  <>
                     {userSongs.map((song, index) => {
                        const active = !inList
                           ? song.id === songInStore.id
                           : selectedSongs?.some((item) => item.id === song.id);

                        return (
                           <div key={index} className="w-full max-[549px]:w-full">
                              <SongListItem
                                 theme={theme}
                                 onClick={() =>
                                    !inList ? handleSetSong(song, index) : setSelect(song)
                                 }
                                 active={active}
                                 key={index}
                                 data={song}
                                 inList={inList}
                              />
                           </div>
                        );
                     })}
                  </>
               ) : (
                  <h1 className="pl-[8px]">No song jet...</h1>
               )}
            </>
         </div>
      </>
   );
}

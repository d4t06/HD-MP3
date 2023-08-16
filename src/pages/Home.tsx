import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { Link } from "react-router-dom";
import { songs } from "../utils/songs";
import SongItem from "../components/ui/SongItem";
import { useDispatch, useSelector } from "react-redux";
import { Song } from "../types";

import { selectAllSongStore, setSong } from "../store/SongSlice";

interface Props {}

const HomePage: FC<Props> = ({ ...props }) => {
   const dispatch = useDispatch();
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   return (
      <div className="text-white pb-[4rem]">
         <div className="flex justify-between mb-5">
            <h3 className="text-2xl font-bold">Last played</h3>
            <Link
               className="text-gray-300 hover:text-gray-100 hover:underline"
               to="/songs"
            >
               All songs
               <ChevronRightIcon className="w-5 h-5 inline ml-2" />
            </Link>
         </div>

         <div className="flex flex-row flex-wrap gap-y-5 -mx-4">
            {songs.map((song, index) => {
               if (index > 5) return;
               return (
                  <div key={song.path} className="w-1/2 px-4 max-[549px]:w-full">
                     <SongItem
                        song={song}
                        active={song.path === songInStore.path}
                        onClick={() => handleSetSong(song, index)}
                     />
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default HomePage;

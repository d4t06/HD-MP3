import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { FC } from "react";
import { Link } from "react-router-dom";
import { songs } from "../utils/songs";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song } from "../types";

interface Props {}

const SongsPage: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore)
   const dispatch = useDispatch();

   const {song: songInStore} = songStore;

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   return (
      <div className="pb-[30px] text-white">
         <h3 className="text-2xl font-bold">All songs</h3>

         <div className="flex flex-row flex-wrap mt-[30px] -mx-[8px]">
            {songs.map((song, index) => {
               return (
                  <div key={index} className="w-1/2 px-[8px]">
                     <SongListItem onClick={() => handleSetSong(song, index)} active={song.path === songInStore.path} key={index} data={song} />
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default SongsPage;

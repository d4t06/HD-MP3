import { FC, useEffect, useState } from "react";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song } from "../types";
import { useTheme } from "../store/ThemeContext";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

interface Props {}

const SongsPage: FC<Props> = () => {
   const songStore = useSelector(selectAllSongStore)
   const dispatch = useDispatch();

   const {song: songInStore} = songStore;
   const {theme} = useTheme()

   const [songs, setSongs] = useState<Song[]>([])

   const songsColectionRef = collection(db, "songs");

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   useEffect(() => {
      const getSongs = async() => {
         try {
            const songsSnap = await getDocs(songsColectionRef) 

            if (songsSnap) {
               const songsList = songsSnap.docs?.map((doc) => doc.data() as Song);
               setSongs(songsList);
            }
         } catch (error) {
            
         }
      }

      getSongs()
   }, [])

   return (
      <div className="pb-[30px] ">
         <h3 className="text-2xl font-bold">All songs</h3>

         <div className="flex flex-row flex-wrap mt-[30px] -mx-[8px]">
            {songs.map((song, index) => {
               return (
                  <div key={index} className="w-1/2 px-[8px] max-[549px]:w-full">
                     <SongListItem theme={theme} onClick={() => handleSetSong(song, index)} active={song.song_path === songInStore.song_path} key={index} data={song} />
                  </div>
               );
            })}
         </div>
      </div>
   );
};

export default SongsPage;

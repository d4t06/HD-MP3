import { RefObject, useMemo } from "react";
import { selectAllSongStore, useActuallySongsStore, useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";

type Base = {
   handleSetSong: (song: Song, index: number) => void;
   activeExtend?: boolean;
   songs: Song[];
};

type Home = Base & {
   location: "home";
};

type MySong = Base & {
   location: "my-songs";
};

type Favorite = Base & {
   location: "favorite";
};

type Queue = Base & {
   location: 'queue'
}

type MyPlaylist = Base & {
   location: "my-playlist";
};

type AdminPlaylist = Base & {
   location: "admin-playlist";
};

// type Props = {
//    songs: Song[];
//    tempSongs?: Song[];
//    addedSongIds?: string[];
//    activeExtend?: boolean;
//    firstTempSongRef?: RefObject<HTMLDivElement>;
//    handleSetSong: (song: Song, index: number) => void;
//    inPlaylist?: Playlist;
//    deleteFromPlaylist?: (song: Song) => Promise<void>;
//    inQueue?: boolean;
//    inHistory?: boolean;
// };

type Props = Home | MySong | MyPlaylist | AdminPlaylist | Queue | Favorite;

// remove song from playlist need playlist songs prop => pass as prop
// add song to playlist use direct from playlist actions
function SongList({ activeExtend = true, handleSetSong, songs, location }: Props) {
   // store
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { actuallySongs } = useActuallySongsStore();

   const renderTempSongsList = () => {
      return tempSongs.map((song, index) => {
         const isAdded = addedSongIds.some((id) => {
            let condition = id === song.id;
            return condition;
         });

         let active = !!activeExtend && songInStore.id === song.id;

         if (index == 0)
            return (
               <SongItem
                  className="temp-song"
                  key={index}
                  active={active}
                  onClick={() => handleSetSong(song, index)}
                  theme={theme}
                  inProcess={!isAdded}
                  data={song}
               />
            );

         return (
            <SongItem
               key={index}
               active={active}
               onClick={() => handleSetSong(song, index)}
               theme={theme}
               inProcess={!isAdded}
               data={song}
            />
         );
      });
   };

   const renderSongList = useMemo(() => {

      switch(location) {
       case "home":
       case "my-songs":
       case "my-playlist":
       case "admin-playlist":
       case "queue":
       case "favorite":
      }

      if (!songs.length && !tempSongs.length)
         return <p className="text-center my-[60px]">... ¯\_(ツ)_/¯</p>;

      return songs.map((song, index) => {
         let active = !!activeExtend && songInStore.id === song.id;
         if (inQueue) active = active && songInStore.currentIndex === index;

         const isLastIndexInQueue =
            songInStore.currentIndex === actuallySongs?.length - 1;

         return (
            <div key={index}>
               <SongItem
                  data={song}
                  theme={theme}
                  active={active}
                  onClick={() => handleSetSong(song, index)}
                  inQueue={inQueue}
                  className={`${
                     inQueue && index < songInStore.currentIndex
                        ? "opacity-[.6] hover:opacity-[1]"
                        : ""
                  }`}
               />

               {inQueue && active && !isLastIndexInQueue && (
                  <div className="mt-[12px] mb-[4px]">
                     <p className={`${theme.content_text} text-[14px] font-[600]`}>
                        Playing next
                     </p>
                  </div>
               )}
            </div>
         );
      });
   }, [songs, tempSongs, songInStore, actuallySongs]);

   return (
      <>
         {renderSongList}
         {!!tempSongs.length && renderTempSongsList()}
      </>
   );
}

export default SongList;

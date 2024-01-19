import { Dispatch, RefObject, SetStateAction, memo } from "react";
import { Playlist, Song } from "../types";
import { selectAllSongStore, useActuallySongs, useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import PlaylistProvider from "../store/PlaylistSongContext";
// import usePlaylistActions from "../hooks/usePlaylistActions";
type Props = {
   songs: Song[];
   tempSongs?: Song[];
   addedSongIds?: string[];
   activeExtend?: boolean;
   firstTempSongRef?: RefObject<HTMLDivElement>;
   handleSetSong: (song: Song, index: number) => void;
   inAdmin?: boolean;
   inPlaylist?: Playlist;
   deleteFromPlaylist?: (song: Song) => Promise<void>;
   inQueue?: boolean;
   inHistory?: boolean;
   controlled?: boolean;
   playlistSongs?: Song[];
   setPlaylistSongs?: Dispatch<SetStateAction<Song[]>>;
};

// remove song from playlist need playlist songs prop => pass as prop
// add song to playlist use direct from playlist actions
function SongList({
   songs,
   // admin,
   inAdmin,
   inPlaylist,
   activeExtend,
   handleSetSong,
   tempSongs = [],
   addedSongIds = [],
   inQueue,
   playlistSongs,
   setPlaylistSongs,
}: Props) {
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { actuallySongs } = useActuallySongs();

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
               //  userInfo={userInfo}
            />
         );
      });
   };

   const renderSongList = () => {
      if (!songs.length && !tempSongs.length) return <h1>No song jet...</h1>;

      return songs.map((song, index) => {
         let active = !!activeExtend && songInStore.id === song.id;
         if (inQueue) active = active && songInStore.currentIndex === index;

         const isLastIndexInQueue = songInStore.currentIndex === actuallySongs?.length - 1;

         return (
            <div key={index}>
               <SongItem
                  data={song}
                  theme={theme}
                  admin={inAdmin}
                  active={active}
                  inPlaylist={inPlaylist}
                  onClick={() => handleSetSong(song, index)}
                  inQueue={inQueue}
                  className={`${inQueue && index < songInStore.currentIndex ? "opacity-[.6] hover:opacity-[1]" : ""}`}
               />

               {inQueue && active && !isLastIndexInQueue && (
                  <div className="mt-[12px] mb-[4px]">
                     <p className={`${theme.content_text} text-[14px] font-[600]`}>Playing next</p>
                  </div>
               )}
            </div>
         );
      });
   };

   return (
      <>
         <PlaylistProvider playlistSongs={playlistSongs || []} setPlaylistSongs={setPlaylistSongs || function () {}}>
            {renderSongList()}
            {!!tempSongs.length && renderTempSongsList()}
         </PlaylistProvider>
      </>
   );
}

export default memo(SongList);

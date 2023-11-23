import { Dispatch, RefObject, SetStateAction, memo } from "react";
import { Playlist, Song } from "../types";
import {
   selectAllSongStore,
   useActuallySongs,
   useAuthStore,
   useSongsStore,
   useTheme,
} from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import usePlaylistActions from "../hooks/usePlaylistActions";
// import { SongWithSongIn } from "../store/SongSlice";

type Props = {
   songs: Song[];
   tempSongs?: Song[];
   addedSongIds?: string[];
   activeExtend?: boolean;
   firstTempSongRef?: RefObject<HTMLDivElement>;
   handleSetSong: (song: Song, index: number) => void;
   inAdmin?: boolean;
   inPlaylist?: Playlist;
   selectedSongs?: Song[];
   isChecked?: boolean;
   setSelectedSongs?: Dispatch<SetStateAction<Song[]>>;
   setIsChecked?: Dispatch<SetStateAction<boolean>>;
   deleteFromPlaylist?: (song: Song) => Promise<void>;
   inQueue?: boolean;
   inHistory?: boolean;
};

// remove song from playlist need playlist songs prop => pass as prop
// add song to playlist use direct from playlist actions
function SongList({
   songs,
   // admin,
   inAdmin,
   inPlaylist,
   // action,
   activeExtend,
   handleSetSong,
   tempSongs = [],
   addedSongIds = [],
   firstTempSongRef,
   inQueue,
   inHistory,

   // isChecked,
   // selectedSongs,
   // setIsChecked,
   // setSelectedSongs,
   // deleteFromPlaylist,
   ...props
}: Props) {
   const { theme } = useTheme();
   const { userInfo, setUserInfo } = useAuthStore();
   const {
      userPlaylists,
      userSongs,
      setUserSongs,
      adminSongs,
      adminPlaylists,
      setAdminSongs,
   } = useSongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { addSongToPlaylistSongItem } = usePlaylistActions({ admin: inAdmin });
   const { actuallySongs, setActuallySongs } = useActuallySongs();

   const renderTempSongsList = () => {
      return tempSongs.map((song, index) => {
         const isAdded = addedSongIds.some((id) => {
            let condition = id === song.id;
            return condition;
         });

         return (
            <SongItem
               key={index}
               active={false}
               onClick={() => handleSetSong(song, index)}
               theme={theme}
               inProcess={!isAdded}
               data={song}
               //  setActuallySongs={setActuallySongs}
               //  actuallySongs={actuallySongs}
            />
         );
      });
   };

   const renderSongList = () => {
      if (!songs.length) return <h1>No song jet...</h1>;

      return songs.map((song, index) => {
         let active = !!activeExtend && songInStore.id === song.id;

         if (inQueue) active = active && songInStore.currentIndex === index;
         return (
            <SongItem
               key={index}
               data={song}
               theme={theme}
               admin={inAdmin}
               active={active}
               userInfo={userInfo}
               songs={inAdmin ? adminSongs : userSongs}
               setSongs={inAdmin ? setAdminSongs : setUserSongs}
               userPlaylists={inAdmin ? adminPlaylists : userPlaylists}
               inPlaylist={inPlaylist}
               setUserInfo={setUserInfo}
               addToPlaylist={addSongToPlaylistSongItem}
               onClick={() => handleSetSong(song, index)}
               actuallySongs={!inHistory ? actuallySongs : undefined}
               setActuallySongs={!inHistory ? setActuallySongs : undefined}
               inQueue={inQueue}
               {...props}

               // deleteFromPlaylist={deleteFromPlaylist}
               // isChecked={isChecked}
               // selectedSongs={selectedSongs}
               // setIsChecked={setIsChecked}
               // setSelectedSongs={setSelectedSongs}
            />
         );
      });
   };

   return (
      <>
         {renderSongList()}
         {!!tempSongs.length && renderTempSongsList()}
      </>
   );
}

export default memo(SongList);

import { Dispatch, SetStateAction, memo, useMemo } from "react";
import { Playlist, Song } from "../types";
import { selectAllSongStore, useAuthStore, useSongsStore, useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import usePlaylistActions from "../hooks/usePlaylistActions";

type Props = {
  songs: Song[];
  activeExtend: boolean;
  handleSetSong: (song: Song, index: number) => void;
  // action: 'full' | 'less'
  inAdmin?: boolean;
  inPlaylist?: Playlist,
  selectedSongs?: Song[];
  isChecked?: boolean;
  setSelectedSongs?: Dispatch<SetStateAction<Song[]>>;
  setIsChecked?: Dispatch<SetStateAction<boolean>>;
  deleteFromPlaylist?: (song: Song) => Promise<void>;
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

  const renderSongList = () => {
    if (!songs.length) return <h1>No song jet...</h1>;

    return songs.map((song, index) => {
      return (
        <SongItem
          key={index}
          data={song}
          theme={theme}
          admin={inAdmin}
          // action={action}
          active={activeExtend && songInStore.id === song.id}
          userInfo={userInfo}
          songs={inAdmin ? adminSongs : userSongs}
          setSongs={inAdmin ? setAdminSongs : setUserSongs}
          userPlaylists={inAdmin ? adminPlaylists : userPlaylists}
          inPlaylist={inPlaylist}
          setUserInfo={setUserInfo}
          addToPlaylist={addSongToPlaylistSongItem}
          onClick={() => handleSetSong(song, index)}
          
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

  return <>{renderSongList()}</>;
}

export default memo(SongList);

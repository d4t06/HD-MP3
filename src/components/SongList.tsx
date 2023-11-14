import { Dispatch, SetStateAction, memo, useMemo } from "react";
import { Song } from "../types";
import { selectAllSongStore, useAuthStore, useSongsStore, useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import usePlaylistActions from "../hooks/usePlaylistActions";

type Props = {
  songs: Song[];
  activeExtend: boolean;
  handleSetSong: (song: Song, index: number) => void;

  admin?: boolean;
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
  admin,
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
  const { addSongToPlaylistSongItem } = usePlaylistActions({ admin });

  const location = useLocation();

  const inPlaylist = useMemo(() => location.pathname.includes("playlist"), [location]);

  const renderSongList = () => {
    if (!songs.length) return <h1>No song jet...</h1>;

    return songs.map((song, index) => {
      return (
        <SongItem
          key={index}
          data={song}
          theme={theme}
          admin={admin}
          active={activeExtend && songInStore.id === song.id}
          userInfo={userInfo}
          userSongs={admin ? adminSongs : userSongs}
          setUserSongs={admin ? setAdminSongs : setUserSongs}
          userPlaylists={admin ? adminPlaylists : userPlaylists}
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

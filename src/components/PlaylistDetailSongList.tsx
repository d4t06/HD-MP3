import { useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useToast, useTheme } from "../store";
import { SongListModal, Button, Modal, SongList } from "../components";
import usePlaylistActions from "../hooks/usePlaylistActions";
import CheckedBar from "./CheckedBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue, setQueue } from "@/store/songQueueSlice";
import SongSelectProvider from "@/store/SongSelectContext";
import { ModalRef } from "./Modal";

type Props = {
  variant: "admin-playlist" | "my-playlist" | "dashboard-playlist";
};

export default function PlaylistDetailSongList({ variant }: Props) {
  // use store
  const dispatch = useDispatch();
  const { theme } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);
  const { from, queueSongs } = useSelector(selectSongQueue);
  const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);

  const modalRef = useRef<ModalRef>(null);

  const closeModal = () => modalRef.current?.toggle();

  // use hooks
  const { setErrorToast } = useToast();
  const { deleteSongFromPlaylist } = usePlaylistActions();

  const handleSetSong = (song: Song, index: number) => {
    // case user play user songs then play playlist song
    const newSongIn: SongIn = `playlist_${currentPlaylist.id}`;

    if (currentSong.id !== song.id || currentSong.song_in !== newSongIn) {
      dispatch(
        setSong({
          ...song,
          currentIndex: index,
          song_in: newSongIn,
        })
      );

      const shouldReplaceQueue =
        from.length > 1 ||
        from[0] != newSongIn ||
        playlistSongs.length !== queueSongs.length;
      if (shouldReplaceQueue) {
        dispatch(setQueue({ songs: playlistSongs }));
      }
    }
  };

  const handleDeleteSongFromPlaylist = async (song: Song) => {
    try {
      await deleteSongFromPlaylist(song);
    } catch (error) {
      console.log(error);
      setErrorToast({});
    }
  };

  const renderCheckBar = useMemo(() => {
    if (!playlistSongs.length) return <></>;

    switch (variant) {
      case "admin-playlist":
        return (
          <CheckedBar variant={"admin-playlist"}>
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        );
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <CheckedBar variant={"my-playlist"}>
            <p className="font-[500] opacity-[.5]">{playlistSongs.length} Songs</p>
          </CheckedBar>
        );
    }
  }, [currentPlaylist, playlistSongs]);

  const renderSongList = useMemo(() => {
    switch (variant) {
      case "admin-playlist":
        return (
          <SongList
            variant="admin-playlist"
            songs={playlistSongs}
            handleSetSong={handleSetSong}
            activeExtend={currentSong.song_in.includes(currentPlaylist.id)}
          />
        );
      case "my-playlist":
      case "dashboard-playlist":
        return (
          <>
            <SongList
              variant={variant}
              songs={playlistSongs}
              handleSetSong={handleSetSong}
              activeExtend={currentSong.song_in.includes(currentPlaylist.id)}
              deleteFromPlaylist={handleDeleteSongFromPlaylist}
            />

            <div className="flex justify-center mt-[20px]">
              <Button
                onClick={() => modalRef.current?.toggle()}
                className={`${theme.content_bg} rounded-full`}
                variant={"primary"}
                size={"clear"}
              >
                <PlusIcon className="w-6 mr-[5px]" />
                <span className="font-playwriteCU leading-[2.2] text-sm">Add song</span>
              </Button>
            </div>
          </>
        );
    }
  }, [currentPlaylist, playlistSongs, currentSong]);

  // const renderModal = useMemo(() => {
  //   switch (isOpenModal) {
  //     case "":
  //       return <></>;
  //     case "add-song":
  //       return
  //   }
  // }, [isOpenModal, playlistSongs, currentPlaylist]);

  return (
    <>
      <SongSelectProvider>
        {renderCheckBar}
        {renderSongList}
      </SongSelectProvider>

      <Modal>
        <SongSelectProvider>
          <SongListModal closeModal={closeModal} playlistSongs={playlistSongs} />;
        </SongSelectProvider>
      </Modal>
    </>
  );
}

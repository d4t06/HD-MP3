import { useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { SongIn } from "../store/SongSlice";
import {
   useToast,
   useActuallySongsStore,
   selectAllSongStore,
   setSong,
   useTheme,
} from "../store";
import { AddSongsToPlaylist, Button, Modal, Skeleton, SongList } from "../components";

import usePlaylistActions from "../hooks/usePlaylistActions";

import { useSongListContext } from "../store/SongListContext";

import CheckedBar from "./CheckedBar";
import { PlusIcon } from "@heroicons/react/24/outline";
import  { usePlaylistContext } from "../store/PlaylistSongContext";

type Props = {
   location: "admin-playlist" | "my-playlist";
};

type Modal = "add-song";

export default function PlaylistDetailSongList({ location }: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { setIsChecked, setSelectedSongs, selectedSongs } = useSongListContext();
   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);

   // state
   const { playlistSongs, setPlaylistSongs } = usePlaylistContext();
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // use hooks
   const { setErrorToast } = useToast();
   const { setActuallySongs } = useActuallySongsStore();
   const { deleteSongFromPlaylist } = usePlaylistActions();

   const closeModal = () => setIsOpenModal("");

   const handleSelectAll = () => {
      if (selectedSongs.length < playlistSongs.length) setSelectedSongs(playlistSongs);
      else resetCheckedList();
   };

   const resetCheckedList = () => {
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const handleSetSong = (song: Song, index: number) => {
      // case user play user songs then play playlist song
      const newSongIn: SongIn = `playlist_${playlistInStore.id}`;

      if (songInStore.id !== song.id || songInStore.song_in !== newSongIn) {
         dispatch(
            setSong({
               ...song,
               currentIndex: index,
               song_in: newSongIn,
            })
         );

         if (songInStore.song_in !== newSongIn) {
            setActuallySongs(playlistSongs);
            console.log("setActuallySongs when playlist list");
         }
      }
   };

   const handleDeleteSongFromPlaylist = async (song: Song) => {
      try {
         const newPlaylistSongs = await deleteSongFromPlaylist(song, playlistSongs);
         if (newPlaylistSongs) {
            setPlaylistSongs(newPlaylistSongs);
            if (songInStore.song_in === `playlist_${playlistInStore.id}`) {
               setActuallySongs(newPlaylistSongs);
               console.log("set actually songs");
            }
         }
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      }
   };

   const renderCheckBar = useMemo(() => {
      if (!playlistSongs.length) return <></>;

      switch (location) {
         case "admin-playlist":
            return (
               <CheckedBar selectAll={handleSelectAll} location={"admin-playlist"}>
                  <p className="font-semibold opacity-[.6]">
                     {playlistSongs.length} Songs
                  </p>
               </CheckedBar>
            );
         case "my-playlist":
            return (
               <CheckedBar selectAll={handleSelectAll} location={"my-playlist"}>
                  <p className="font-semibold opacity-[.6]">
                     {playlistSongs.length} Songs
                  </p>
               </CheckedBar>
            );
      }
   }, [playlistInStore, playlistSongs]);

   const renderSongList = useMemo(() => {
      switch (location) {
         case "admin-playlist":
            return (
               <SongList
                  songs={playlistSongs}
                  // inPlaylist={playlistInStore}
                  handleSetSong={handleSetSong}
                  activeExtend={songInStore.song_in.includes(playlistInStore.id)}
               />
            );
         case "my-playlist":
            return (
               <>
                  <SongList
                     songs={playlistSongs}
                     // inPlaylist={playlistInStore}
                     handleSetSong={handleSetSong}
                     activeExtend={songInStore.song_in.includes(playlistInStore.id)}
                     deleteFromPlaylist={handleDeleteSongFromPlaylist}
                  />

                  <div className="flex justify-center mt-[20px]">
                     <Button
                        onClick={() => setIsOpenModal("add-song")}
                        className={`${theme.content_bg} rounded-full`}
                        variant={"primary"}
                     >
                        <PlusIcon className="w-[24px] mr-[5px]" />
                        Add song
                     </Button>
                  </div>
               </>
            );
      }
   }, [playlistInStore, playlistSongs, songInStore]);

   const renderModal = useMemo(() => {
      switch (isOpenModal) {
         case "":
            return <></>;
         case "add-song":
            return (
               <AddSongsToPlaylist
                  playlist={playlistInStore}
                  close={closeModal}
                  setPlaylistSongs={setPlaylistSongs}
                  playlistSongs={playlistSongs}
               />
            );
      }
   }, [isOpenModal, playlistSongs, playlistInStore]);

   return (
      <>
         {renderCheckBar}
         {renderSongList}
         {!!isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

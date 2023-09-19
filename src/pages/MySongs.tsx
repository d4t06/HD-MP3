import { PlusCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode, useEffect, useRef, useState, useCallback } from "react";
import { Playlist, Song } from "../types";

import { db, store } from "../config/firebase";
import { deleteDoc, doc, setDoc } from "firebase/firestore";

// import { routes } from "../routes";
// import { useNavigate } from "react-router-dom";

import { useTheme } from "../store/ThemeContext";

import Modal from "../components/Modal";
import PopupWrapper from "../components/ui/PopupWrapper";
import PlaylistItem from "../components/ui/PlaylistItem";
import Button from "../components/ui/Button";
import useSongs from "../hooks/useUserSong";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setPlaylist, setSong } from "../store/SongSlice";
import useUploadSongs from "../hooks/useUploadSongs";
import Empty from "../components/ui/Empty";
import { useSongsStore } from "../store/SongsContext";
import { deleteObject, ref } from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { routes } from "../routes";
import { updatePlaylistsValue, setUserPlaylistIdsDoc } from "../utils/crud";

interface Props {}
type ModalName = "ADD_PLAYLIST" | "MESSAGE";

const SongsPage: FC<Props> = () => {
   const dispatch = useDispatch();

   const { theme } = useTheme();

   const { loading, errorMsg } = useSongs();

   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);
   const { userData, userSongs, userPlaylists, setUserSongs, setUserPlaylists } =
      useSongsStore();

   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");

   const [playlistName, setPlayListName] = useState<string>("");
   // const [playlistIds, setPlaylistIds] = useState<string[]>([]);

   const [songCount, setSongCount] = useState(0);
   const [isHasSong, setIsHasSong] = useState(false);

   const navigate = useNavigate();

   //  for delete song
   const [selectedSongList, setSelectedSongList] = useState<Song[]>([]);
   const [isCheckedSong, setIsCheckedSong] = useState(false);

   // useUploadSong
   const audioRef = useRef<HTMLAudioElement>(null);
   const message = useRef<string>("");
   const duplicatedFile = useRef<Song[]>([]);

   const handleOpenModal = (name: ModalName) => {
      setModalName(name);
      setOpenModal(true);
   };

   const { tempSongs, addedSongIds, status, handleInputChange } = useUploadSongs({
      audioRef,
      message,
      handleOpenModal,
      duplicatedFile,
   });

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index, song_in: "user" }));
   };

   const checkIsHasSong = useCallback(() => {
      // console.log("call has song");
      // setIsHasSong(!!tempSongs.length || !!userSongs.length);
      return !!tempSongs.length || !!userSongs.length;
   }, [tempSongs, userSongs]);

   const countSong = useCallback(() => {
      // setSongCount(tempSongs.length + userSongs.length);
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs]);

   const handleDeleteSongs = async () => {
      const newUserSongs = [...userSongs];

      try {
         // loop each selected song
         const deletedSongList: string[] = [];

         // delete songfile, song doc and playlist doc
         for (let song of selectedSongList) {
            // create song ref
            const songFileRef = ref(store, song.file_name);

            // Delete the file
            await deleteObject(songFileRef);

            // Delete the song doc
            await deleteDoc(doc(db, "songs", song.id));

            newUserSongs.splice(newUserSongs.indexOf(song), 1);

            if (song.lyric_id) {
               // Delete lyric doc
               await deleteDoc(doc(db, "lyrics", song.lyric_id));
            }

            deletedSongList.push(song.id);
         }

         // update song_ids, song_count to user doc
         const userDocRef = doc(db, "users", userData?.email as string);
         const userSongIds: string[] = newUserSongs.map((song) => song.id);

         await setDoc(
            userDocRef,
            {
               song_ids: userSongIds,
               song_count: userSongIds.length,
            },
            { merge: true }
         );
         // const index = songs.indexOf(song);
         // newSongs.splice(index, 1);

         const newSongs = userSongs.filter(
            (song) => deletedSongList.indexOf(song.id) === -1
         );
         setUserSongs(newSongs);
         setSelectedSongList([]);
         setIsCheckedSong(false);
         // console.log("set songs");
      } catch (error) {
         console.log({ message: error });
      }
   };

   const handleAddPlaylist = async () => {
      const playlistId = `${playlistName}_${userData?.email as string}`;

      const addedPlaylist: Playlist = {
         by: userData?.email || "users",
         name: playlistName,
         song_ids: [],
         count: 0,
         time: 0,
         image_path: "",
         id: playlistId,
      };

      // insert new playlist to users playlist
      const newPlaylists = [...userPlaylists, addedPlaylist];

      // add to playlist collection
      await setDoc(doc(db, "playlist", playlistId), addedPlaylist);

      // update user doc
      await setUserPlaylistIdsDoc(newPlaylists, userData);

      // update context store user playlists
      setUserPlaylists(newPlaylists, []);
      setOpenModal(false);
   };

   const handleOpenPlaylist = (playlist: Playlist) => {
      // if this playlist current in store
      if (playlistInStore.name != playlist.name) dispatch(setPlaylist(playlist));

      navigate(`${routes.Playlist}/${playlist.name}`);
   };

   const addSongToPlaylist = async (song: Song, playList: Playlist) => {
      const newSongIds = [...playList.song_ids, song.id];
      const time = playList.time + song.duration;

      const addedPlaylist: Playlist = {
         ...playList,
         time,
         song_ids: newSongIds,
         count: newSongIds.length,
      };

      const newUserPlaylists = [...userPlaylists];

      updatePlaylistsValue(addedPlaylist, newUserPlaylists);

      try {
         // update to database
         // await setDoc(
         //    doc(db, "playlist", playList.id),
         //    { song_ids: newSongIds, count: newSongIds.length, time },
         //    { merge: true }
         // );

         // update users playlist to context
         setUserPlaylists(newUserPlaylists, []);

         // if user is playing this playlist
         // need to update playlist in store to get actually song
         if (playlistInStore.name === playList.name) {
            dispatch(setPlaylist(addedPlaylist));
         }
      } catch (error) {
         console.log(error);
      }
   };

   const renderTempSongs = () => {
      return tempSongs.map((song, index) => {
         const isAdded = addedSongIds.some((id) => {
            let condition = id === song.id;
            return condition;
         });

         return (
            <div key={index} className="w-full max-[549px]:w-full">
               <SongListItem theme={theme} inProcess={!isAdded} key={index} data={song} />
            </div>
         );
      });
   };

   const renderUserSongs = () => {
      return userSongs.map((song, index) => {
         const active = song.id === songInStore.id && songInStore.song_in === "user";
         return (
            <div key={index} className="w-full max-[549px]:w-full">
               <SongListItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={active}
                  key={index}
                  data={song}
                  userData={userData}
                  userSongs={userSongs}
                  isCheckedSong={isCheckedSong}
                  userPlaylists={userPlaylists}
                  selectedSongList={selectedSongList}
                  setUserSongs={setUserSongs}
                  setIsCheckedSong={setIsCheckedSong}
                  setSelectedSongList={setSelectedSongList}
                  addSongToPlaylist={addSongToPlaylist}
               />
            </div>
         );
      });
   };

   const classes = {
      button: `${theme.content_bg} rounded-full`,
   };

   const addPlaylistModal = (
      <div className="w-[300px]">
         <Button
            className="absolute top-2 right-2 text-white"
            onClick={() => setOpenModal(false)}
         >
            <XMarkIcon className="w-6 h-6" />
         </Button>
         <h2 className="text-[18px] font-semibold text-white">Add Playlist</h2>
         <input
            className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
            type="text"
            placeholder="name..."
            value={playlistName}
            onChange={(e) => setPlayListName(e.target.value)}
         />

         <Button
            onClick={() => handleAddPlaylist()}
            variant={"primary"}
            className={`${classes.button} mt-[15px]`}
         >
            Save
         </Button>
      </div>
   );
   const messageModal = (
      <div className="w-[300px]">
         {message.current}
         {!!duplicatedFile.current.length &&
            duplicatedFile.current.map((song) => (
               <p className="text-[14px]">- {song.name}</p>
            ))}
      </div>
   );

   const ModalPopup: Record<ModalName, ReactNode> = {
      ADD_PLAYLIST: addPlaylistModal,
      MESSAGE: messageModal,
   };

   useEffect(() => {
      if (duplicatedFile.current.length) {
         duplicatedFile.current = [];
      }
   }, [openModal]);

   // useEffect(() => {
   // checkIsHasSong();
   // if (userSongs.length || tempSongs.length) {
   //    countSong();
   // }
   // }, [userSongs, tempSongs]);

   if (loading) return <h1>...Loading</h1>;

   if (errorMsg) return <h1>{errorMsg}</h1>;

   return (
      <>
         {/* playlist */}
         <div className="pb-[30px] ">
            <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>
            <div className="flex flex-row -mx-[8px]">
               {!!userPlaylists.length &&
                  userPlaylists.map((playList, index) => (
                     <div key={index} className="w-1/4 p-[8px]">
                        <PlaylistItem
                           onClick={() => handleOpenPlaylist(playList)}
                           theme={theme}
                           data={playList}
                           userPlaylists={userPlaylists}
                           userData={userData}
                           setUserPlaylists={setUserPlaylists}
                        />
                     </div>
                  ))}
               <div className="w-1/4 p-[8px]">
                  <Empty
                     theme={theme}
                     className="pt-[100%]"
                     onClick={() => handleOpenModal("ADD_PLAYLIST")}
                  />
               </div>
            </div>
         </div>

         {/* song list */}
         <div className="pb-[30px] ">
            {/* title */}
            <div className="flex justify-between mb-[10px]">
               <h3 className="text-2xl font-bold">Songs</h3>
               <input
                  onChange={handleInputChange}
                  type="file"
                  multiple
                  accept=".mp3"
                  id="file"
                  className="hidden"
               />
               <audio ref={audioRef} className="hidden" />
               <div className="flex items-center">
                  {checkIsHasSong() && (
                     <label
                        className={`${theme.content_bg} ${
                           status === "uploading" ? "opacity-60 pointer-events-none" : ""
                        } rounded-full flex px-[20px] py-[4px] text-white cursor-pointer`}
                        htmlFor="file"
                     >
                        <PlusCircleIcon className="w-[20px] mr-[5px]" />
                        Upload
                     </label>
                  )}
                  <Button
                     onClick={() => setUserSongs([])}
                     variant={"primary"}
                     className={`ml-[15px] ${theme.content_bg} rounded-full`}
                  >
                     Clear
                  </Button>
               </div>
            </div>

            {/* song list */}
            <div
               className={`flex gap-[20px] items-center border-b border-${theme.alpha} h-[50px] mb-[10px]`}
            >
               {!isCheckedSong ? (
                  <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                     {countSong() + " songs"}
                  </p>
               ) : (
                  <p className={`text-[14px]] font-semibold text-gray-500 w-[100px]`}>
                     {selectedSongList.length + " selected"}
                  </p>
               )}
               {isCheckedSong && userSongs.length && (
                  <>
                     <Button
                        onClick={() => setSelectedSongList(userSongs)}
                        variant={"primary"}
                        className={classes.button}
                     >
                        Select all
                     </Button>
                     <Button
                        onClick={() => handleDeleteSongs()}
                        variant={"primary"}
                        className={classes.button}
                     >
                        Delete
                     </Button>
                     <Button
                        onClick={() => {
                           setIsCheckedSong(false);
                           setSelectedSongList([]);
                        }}
                        variant={"primary"}
                        className={classes.button}
                     >
                        <XMarkIcon className="w-[20px]" />
                     </Button>
                  </>
               )}
            </div>
            <div className="-mx-[8px] min-h-[50vh]">
               {checkIsHasSong() ? (
                  <>
                     {!!tempSongs.length && renderTempSongs()}
                     {!!userSongs.length && renderUserSongs()}
                  </>
               ) : (
                  <div className="text-left mt-[30px]">
                     <label
                        className={`${theme.content_bg} rounded-full inline-flex px-[20px] py-[4px] text-white cursor-pointer`}
                        htmlFor="file"
                     >
                        <PlusCircleIcon className="w-[20px] mr-[5px]" />
                        Upload song
                     </label>
                  </div>
               )}
            </div>
         </div>

         {/* add playlist modal */}
         {openModal && (
            <Modal setOpenModal={setOpenModal}>
               <PopupWrapper theme={theme}>{ModalPopup[modalName]}</PopupWrapper>
            </Modal>
         )}
      </>
   );
};

export default SongsPage;

import { PlusCircleIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Playlist, Song } from "../types";

import { db } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";

// import { routes } from "../routes";
// import { useNavigate } from "react-router-dom";

import { useTheme } from "../store/ThemeContext";

import Modal from "../components/Modal";
import PopupWrapper from "../components/ui/PopupWrapper";
import PlaylistItem from "../components/ui/PlaylistItem";
import Button from "../components/ui/Button";
import useUserSong from "../hooks/useUserSong";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import useUploadSongs from "../hooks/useUploadSongs";
import Empty from "../components/ui/Empty";

interface Props {}
type ModalName = "ADD_PLAYLIST" | "OVERLOAD";

const SongsPage: FC<Props> = () => {
   const dispatch = useDispatch();

   const { theme } = useTheme();

   const { song: songInStore } = useSelector(selectAllSongStore);
   // const {
   //    userData,
   //    songs: userSongs,
   //    playlists: userPlaylists,
   //    setPlaylistIds,
   //    loading,
   // } = useUserSong();

   const [openModal, setOpenModal] = useState(false);
   const [modalName, setModalName] = useState<ModalName>("ADD_PLAYLIST");
   const [playlistName, setPlayListName] = useState<string>("");

   const audioRef = useRef<HTMLAudioElement>(null);
   const { tempSongs, setTempSongs, addedSongs, status, handleInputChange } =
      useUploadSongs(audioRef);

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   const renderTempSongs = () => {
      // console.log('render song lenth =', tempSongs.length);
      // console.log('render  tempsongs =', tempSongs);

      return tempSongs.map((song, index) => {
         const isAdded = addedSongs.some((id) => {
            let condition = id === song.id;
            // console.log('added song', id , '===', song.id, 'index =', index, condition, condition ? 'end' : '');
            return condition;
         });

         return (
            <div key={index} className="w-full max-[549px]:w-full">
               <SongListItem
                  theme={theme}
                  onClick={() => handleSetSong(song, index)}
                  active={song.song_path === songInStore.song_path}
                  inProcess={!isAdded}
                  key={index}
                  data={song}
               />
            </div>
         );
      });
   };

   // const renderUserSongs = () => {
   //    return userSongs.map((song, index) => {
   //       const active = song.id === songInStore.id;
   //       return (
   //          <div key={index} className="w-full max-[549px]:w-full">
   //             <SongListItem
   //                theme={theme}
   //                onClick={() => handleSetSong(song, index)}
   //                active={active}
   //                key={index}
   //                data={song}
   //             />
   //          </div>
   //       );
   //    });
   // };

   const countSong = () => {
      return tempSongs.length;
   };

   const handleOpenModal = (name: ModalName) => {
      setModalName(name);
      setOpenModal(true);
   };

   const isHasSongs = !!tempSongs.length;

   // const handleAddPlaylist = async () => {
   //    const playlistId = `${playlistName}_${userData?.email as string}`;

   //    // add to playlist collection
   //    await setDoc(doc(db, "playlist", playlistId), {
   //       by: userData?.email || "users",
   //       name: playlistName,
   //       song_ids: [],
   //       count: 0,
   //       time: 0,
   //       image_path: "",
   //       id: playlistId,
   //    } as Playlist);

   //    const newPlaylitsIds = [...userData.playlist_ids, playlistId];

   //    // update user playlist
   //    await setDoc(
   //       doc(db, "users", userData?.email as string),
   //       {
   //          playlist_ids: newPlaylitsIds,
   //       },
   //       {
   //          merge: true,
   //       }
   //    );
   //    setOpenModal(false);
   //    setPlaylistIds(newPlaylitsIds);
   // };

   // console.log("check render mysongs", { userSongs, userPlaylists, userData });
   //  console.log("check temp songs", tempSongs);

   // if (loading) return <h1>Loading...</h1>;

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

         {/* <Button
         onClick={() => handleAddPlaylist()}
         variant={"primary"}
         className={`mt-[15px] ${
            theme.content_bg
         } w-full rounded-full justify-center ${
            !playlistName && "opacity-60 pointer-events-none"
         }`}
      >
         Save
      </Button> */}
      </div>
   );
   const overLoadModal = (
      <div className="w-[300px]">
         <h1 className="text-[20px] font-semibold">Error</h1>
         <p className="text-[16px]">Overload files upload</p>
      </div>
   );

   const ModalPopup: Record<ModalName, ReactNode> = {
      ADD_PLAYLIST: addPlaylistModal,
      OVERLOAD: overLoadModal,
   };

   useEffect(() => {
      if (status === "overload") handleOpenModal("OVERLOAD");
   }, [status]);

   return (
      <>
         {/* playlist */}
         <div className="pb-[30px] ">
            <h3 className="text-2xl font-bold mb-[10px]">Playlist</h3>
            {/* <Button onClick={() => setOpenModal(true)} className="ml-[12px]">
                  <PlusIcon className="w-[20px]" />
               </Button> */}

            <div className="flex flex-row -mx-[8px]">
               <div className="w-1/4 p-[8px]">
                  <Empty theme={theme} className="pt-[100%]" onClick={() => handleOpenModal("ADD_PLAYLIST")} />
               </div>
               {/* {!!userPlaylists.length &&
                  userPlaylists.map((playList, index) => (
                     <div key={index} className="w-1/4 p-[8px]">
                        <PlaylistItem theme={theme} data={playList} />
                     </div>
                  ))} */}
            </div>
         </div>

         {/* my songs */}
         <div className="pb-[30px] ">
            <div className="flex justify-between">
               <h3 className="text-2xl font-bold mb-[10px]">Songs</h3>
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
                  {isHasSongs && (
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
                  {/* <Button
                     onClick={() => setTempSongs([])}
                     variant={"primary"}
                     className={`ml-[15px] ${theme.content_bg} rounded-full`}
                  >
                     Clear
                  </Button> */}
               </div>
            </div>
         </div>

         <div className="pb-[60px]">
            {isHasSongs && (
               <p className="text-[14px] pl-[10px] font-semibold text-gray-500 border-b border-gray-500">
                  {countSong() + " songs"}
               </p>
            )}
            <div className="-mx-[8px] mt-[15px]">
               {tempSongs.length ? (
                  <>
                     {!!tempSongs.length && renderTempSongs()}
                     {/* {!!userSongs.length && renderUserSongs()} */}
                  </>
               ) : (
                  <div className="text-center mt-[30px]">
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

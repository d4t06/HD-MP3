import { ReactNode, useMemo, useState } from "react";
import { Button, ConfirmModal, Modal } from ".";
import {
   selectAllSongStore,
   useActuallySongsStore,
   useAuthStore,
   useSongsStore,
   useTheme,
   useToast,
} from "../store";
import { useSongListContext } from "../store/SongListContext";
import { QueueListIcon } from "@heroicons/react/24/outline";
import CheckedCta from "./CheckedCta";
import { useDispatch, useSelector } from "react-redux";
import { SongWithSongIn, setSong } from "../store/SongSlice";
import { deleteSong, setUserSongIdsAndCountDoc } from "../utils/firebaseHelpers";
import { initSongObject } from "../utils/appHelpers";
import { usePlaylistContext } from "../store/PlaylistSongContext";
import usePlaylistActions from "../hooks/usePlaylistActions";


type Home = {
   location: "home";
};

type MyPlaylist = {
   location: "my-playlist";
   selectAll: () => void;
};

type MySongs = {
   location: "my-songs";
   selectAll: () => void;
};

type AdminPlaylist = {
   location: "admin-playlist";
   selectAll: () => void;
};

type Modal = "delete-selected-songs" | "remove-selects-songs";

type OutlineButtonProps = {
   onClick: () => void;
   children: ReactNode;
   className: string;
};

type Props = MyPlaylist | AdminPlaylist | MySongs | Home;

const OutlineButton = ({ children, onClick, className }: OutlineButtonProps) => {
   return (
      <Button onClick={onClick} variant={"outline"} size={"small"} className={className}>
         {children}
      </Button>
   );
};

export default function CheckedBar({
   children,
   ...props
}: Props & {
   children?: ReactNode;
}) {
   // store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const {
      isChecked,
      selectedSongs,
      setIsChecked,
      setSelectedSongs,
      reset: resetCheckedList,
   } = useSongListContext();
   const { playlistSongs, setPlaylistSongs } = usePlaylistContext();
   const { playlist: playlistInStore, song: songInStore } =
      useSelector(selectAllSongStore);
   const { userSongs, setUserSongs } = useSongsStore();
   const { actuallySongs, setActuallySongs } = useActuallySongsStore();

   // state
   const [isFetching, setIsFetching] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();
   const { deleteManyFromPlaylist, isFetching: playlistActionLoading } =
      usePlaylistActions();

   const closeModal = () => {
      setIsOpenModal("");
   };

   const handleSelectUserSongs = () => {
      if (selectedSongs.length < userSongs.length) setSelectedSongs(userSongs);
      else resetCheckedList();
   };

   const handleSelectAllPlaylistSongs = () => {
      if (selectedSongs.length < playlistSongs.length) setSelectedSongs(playlistSongs);
      else resetCheckedList();
   };

   const addSongsToQueue = () => {
      let newQueue: Song[];

      switch (props.location) {
         case "my-playlist":
         case "admin-playlist":
            const newSelectedSongs = selectedSongs.map(
               (s) =>
                  ({ ...s, song_in: `playlist_${playlistInStore.id}` } as SongWithSongIn)
            );
            newQueue = [...actuallySongs, ...newSelectedSongs];

            break;
         case "my-songs":
            newQueue = [...actuallySongs, ...selectedSongs];
            setActuallySongs(newQueue);
            setSuccessToast({ message: "Songs added to queue" });
            break;
         case "home":
            newQueue = [...actuallySongs, ...selectedSongs];

            setSuccessToast({ message: "songs added to queue" });
      }

      console.log("setActuallySongs");
      setActuallySongs(newQueue);
      resetCheckedList();
   };

   const handleDeleteSelectedSong = async () => {
      if (!user) return;

      let newUserSongs = [...userSongs];
      const deletedIds: string[] = [];

      try {
         setIsFetching(true);
         // >>> api
         for (let song of selectedSongs) {
            await deleteSong(song);

            newUserSongs = newUserSongs.filter((s) => s.id !== song.id);
            deletedIds.push(song.id);
         }
         const userSongIds: string[] = newUserSongs.map((song) => song.id);
         await setUserSongIdsAndCountDoc({ songIds: userSongIds, user });

         // handle song queue
         if (songInStore.song_in === "user") {
            const newSongQueue = actuallySongs.filter((s) => !deletedIds.includes(s.id));
            setActuallySongs(newSongQueue);
            console.log("setActuallySongs");
         }

         // handle song in store
         if (deletedIds.includes(songInStore.id)) {
            const emptySong = initSongObject({});
            dispatch(setSong({ ...emptySong, song_in: "", currentIndex: 0 }));
         }

         // handle user songs
         setUserSongs(newUserSongs);

         // >>> finish
         setSuccessToast({ message: `${selectedSongs.length} songs deleted` });
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete songs" });
      } finally {
         resetCheckedList();
         setIsFetching(false);
      }
   };

   const handleDeleteManyFromPlaylist = async () => {
      try {
         const newPlaylistSongs = await deleteManyFromPlaylist(
            selectedSongs,
            playlistSongs
         );
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
      } finally {
         setIsChecked(false);
         setSelectedSongs([]);
      }
   };

   const classes = {
      outlineButton: `border-${theme.alpha} ${theme.side_bar_bg}`,
   };

   const renderModal = useMemo(() => {
      if (!isOpenModal) return;

      switch (isOpenModal) {
         case "delete-selected-songs":
            return (
               <ConfirmModal
                  loading={playlistActionLoading}
                  label={`Delete ${selectedSongs.length} songs ?`}
                  theme={theme}
                  callback={handleDeleteSelectedSong}
                  close={closeModal}
               />
            );
         case "remove-selects-songs":
            return (
               <ConfirmModal
                  loading={isFetching}
                  label={`Remove ${selectedSongs.length} songs ?`}
                  theme={theme}
                  callback={handleDeleteManyFromPlaylist}
                  close={closeModal}
               />
            );
      }
   }, [isOpenModal, playlistActionLoading]);

   const content = useMemo(() => {
      switch (props.location) {
         case "home":
            return (
               <>
                  {!isChecked && <h3 className="text-2xl font-bold mr-[14px]">Songs</h3>}

                  {isChecked && (
                     <CheckedCta location={props.location} reset={() => {}}>
                        <p className="font-semibold opacity-[.6]">
                           {selectedSongs.length}
                        </p>
                        <OutlineButton
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           <QueueListIcon className="w-[20px] mr-[4px]" />
                           Add to songs queue
                        </OutlineButton>
                     </CheckedCta>
                  )}
               </>
            );

         case "my-songs":
            return (
               <>
                  {!isChecked && children}

                  {isChecked && (
                     <CheckedCta
                        selectAll={handleSelectUserSongs}
                        location={props.location}
                        reset={resetCheckedList}
                     >
                        <p className="font-semibold opacity-[.6]">
                           {selectedSongs.length}
                        </p>
                        <OutlineButton
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           Add to songs queue
                        </OutlineButton>

                        <OutlineButton
                           onClick={() => console.log("confirm modal")}
                           className={classes.outlineButton}
                        >
                           Delete
                        </OutlineButton>
                     </CheckedCta>
                  )}
               </>
            );

         case "my-playlist":
            return (
               <>
                  {!isChecked && children}

                  {isChecked && (
                     <CheckedCta
                        selectAll={handleSelectAllPlaylistSongs}
                        location={props.location}
                        reset={resetCheckedList}
                     >
                        <p className="font-semibold opacity-[.6]">
                           {selectedSongs.length}
                        </p>
                        <OutlineButton
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           Add to songs queue
                        </OutlineButton>

                        <OutlineButton
                           onClick={handleDeleteManyFromPlaylist}
                           className={classes.outlineButton}
                        >
                           Remove
                        </OutlineButton>
                     </CheckedCta>
                  )}
               </>
            );
         case "admin-playlist":
            return (
               <>
                  {!isChecked && <h3 className="text-2xl font-bold mr-[14px]">Songs</h3>}

                  {isChecked && (
                     <CheckedCta
                        selectAll={handleSelectAllPlaylistSongs}
                        location={props.location}
                        reset={resetCheckedList}
                     >
                        <p className="font-semibold opacity-[.6]">
                           {selectedSongs.length}
                        </p>
                        <OutlineButton
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           Add to songs queue
                        </OutlineButton>
                     </CheckedCta>
                  )}
               </>
            );
      }
   }, [isChecked, selectedSongs, props]);

   return (
      <>
         <div className="h-[30px] mb-[10px] flex items-center space-x-[8px]">
            {content}
         </div>

         {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

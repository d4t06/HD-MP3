import { ReactNode, useMemo, useState } from "react";
import { Button, ConfirmModal, Modal } from ".";
import { useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import { useSongListContext } from "../store/SongListContext";
import { QueueListIcon } from "@heroicons/react/24/outline";
import CheckedCta from "./CheckedCta";
import { useDispatch, useSelector } from "react-redux";
import { deleteSong } from "../utils/firebaseHelpers";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { resetCurrentSong, selectCurrentSong } from "@/store/currentSongSlice";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import {
   addSongToQueue,
   selectSongQueue,
   setQueue,
} from "@/store/songQueueSlice";
import { selectSongPlaylist, setUserSongs } from "@/store/songPlaylistSlice";

type Home = {
   location: "home";
};

type MyPlaylist = {
   location: "my-playlist";
};

type MySongs = {
   location: "my-songs";
};

type AdminPlaylist = {
   location: "admin-playlist";
};

type DashBoardSong = {
   location: "dashboard-songs";
};

type DashBoardPlaylist = {
   location: "dashboard-playlist";
};

type Modal = "delete-selected-songs" | "remove-selects-songs";

type OutlineButtonProps = {
   onClick: () => void;
   children: ReactNode;
   className: string;
};

type Props =
   | MyPlaylist
   | AdminPlaylist
   | MySongs
   | Home
   | DashBoardSong
   | DashBoardPlaylist;

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
   const { currentSong } = useSelector(selectCurrentSong);
   const { queueSongs } = useSelector(selectSongQueue);
   const { playlistSongs } = useSelector(selectCurrentPlaylist);
   const { userSongs } = useSongsStore();

   // state
   const [isFetching, setIsFetching] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();
   // const {} = useSongItemActions()
   const { deleteSongsFromPlaylist, isFetching: playlistActionLoading } =
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
      let songsWithSongIn = selectedSongs;

      dispatch(addSongToQueue({ songs: songsWithSongIn }));
      setSuccessToast({ message: "songs added to queue" });
      resetCheckedList();
   };

   const handleDeleteSelectedSong = async () => {
      if (!user) return;

      try {
         setIsFetching(true);
         const selectedSongIds = selectedSongs.map((s) => s.id);
         // >>> api
         for (let song of selectedSongs) await deleteSong(song);

         const newSongs = userSongs.filter((s) => !selectedSongIds.includes(s.id));

         // handle song queue
         if (currentSong.song_in === "user") {
            const newQueue = queueSongs.filter((s) => !selectedSongIds.includes(s.id));
            if (newQueue.length !== queueSongs.length)
               dispatch(setQueue({ songs: newQueue }));
         }
         if (selectedSongIds.includes(currentSong.id)) dispatch(resetCurrentSong());

         dispatch(setUserSongs({ songs: newSongs }));
         setSuccessToast({ message: `${selectedSongs.length} songs deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         resetCheckedList();
         setIsFetching(false);
         closeModal();
      }
   };

   const handleDeleteManyFromPlaylist = async () => {
      try {
         await deleteSongsFromPlaylist(selectedSongs);
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when delete song" });
      } finally {
         closeModal();
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
                  loading={isFetching}
                  label={`Delete ${selectedSongs.length} songs ?`}
                  theme={theme}
                  callback={handleDeleteSelectedSong}
                  close={closeModal}
               />
            );
         case "remove-selects-songs":
            return (
               <ConfirmModal
                  loading={playlistActionLoading}
                  label={`Remove ${selectedSongs.length} songs ?`}
                  theme={theme}
                  callback={handleDeleteManyFromPlaylist}
                  close={closeModal}
               />
            );
      }
   }, [isOpenModal, playlistActionLoading, isFetching]);

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

         case "dashboard-songs":
            return (
               <>
                  {!isChecked && children}
                  {isChecked && (
                     <CheckedCta location={props.location} reset={resetCheckedList}>
                        <p className="font-semibold opacity-[.6]">
                           {selectedSongs.length}
                        </p>

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
                           onClick={() => setIsOpenModal("delete-selected-songs")}
                           className={classes.outlineButton}
                        >
                           Delete
                        </OutlineButton>
                     </CheckedCta>
                  )}
               </>
            );

         case "dashboard-playlist":
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
                        {props.location !== "dashboard-playlist" && (
                           <OutlineButton
                              onClick={addSongsToQueue}
                              className={classes.outlineButton}
                           >
                              Add to songs queue
                           </OutlineButton>
                        )}

                        <OutlineButton
                           onClick={() => setIsOpenModal("remove-selects-songs")}
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

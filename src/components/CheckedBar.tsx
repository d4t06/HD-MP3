import { ReactNode, useMemo, useState } from "react";
import { Button, ConfirmModal, Modal } from ".";
import { useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import CheckedCta from "./CheckedCta";
import { useDispatch, useSelector } from "react-redux";
import { deleteSong } from "@/services/firebaseService";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { addSongToQueue } from "@/store/songQueueSlice";
import { useSongSelectContext } from "@/store/SongSelectContext";

type Home = {
   variant: "home";
};

type MyPlaylist = {
   variant: "my-playlist";
};

type MySongs = {
   variant: "my-songs";
};

type AdminPlaylist = {
   variant: "admin-playlist";
};

type DashBoardSong = {
   variant: "dashboard-songs";
};

type DashBoardPlaylist = {
   variant: "dashboard-playlist";
};

type Modal = "delete-selected-songs" | "remove-selects-songs";

type Props =
   | MyPlaylist
   | AdminPlaylist
   | MySongs
   | Home
   | DashBoardSong
   | DashBoardPlaylist;

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
   const { isChecked, selectedSongs, selectAll, resetSelect } = useSongSelectContext();
   const { playlistSongs } = useSelector(selectCurrentPlaylist);
   const { userSongs, setUserSongs } = useSongsStore();

   // state
   const [isFetching, setIsFetching] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // hooks
   const { setErrorToast, setSuccessToast } = useToast();
   const { deleteSongsFromPlaylist, isFetching: playlistActionLoading } =
      usePlaylistActions();

   const closeModal = () => {
      setIsOpenModal("");
   };

   const handleSelectUserSongs = () => {
      if (selectedSongs.length < userSongs.length) selectAll(userSongs);
      else resetSelect();
   };

   const handleSelectAllPlaylistSongs = () => {
      if (selectedSongs.length < playlistSongs.length) selectAll(playlistSongs);
      else resetSelect();
   };

   const addSongsToQueue = () => {
      let songsWithSongIn = selectedSongs;

      dispatch(addSongToQueue({ songs: songsWithSongIn }));
      setSuccessToast({ message: "songs added to queue" });
      resetSelect();
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
         // if (currentSong.song_in === "user") {
         //    const newQueue = queueSongs.filter((s) => !selectedSongIds.includes(s.id));
         //    if (newQueue.length !== queueSongs.length)
         //       dispatch(setQueue({ songs: newQueue }));
         // }
         // if (selectedSongIds.includes(currentSong.id)) dispatch(resetCurrentSong());

         setUserSongs(newSongs);
         setSuccessToast({ message: `${selectedSongs.length} songs deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         resetSelect();
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
         resetSelect();
      }
   };

   const classes = {
      outlineButton: `border-${theme.alpha} ${theme.side_bar_bg} space-x-1`,
      icon: "w-[20px]",
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
      switch (props.variant) {
         case "home":
            return (
               <>
                  {!isChecked && <h3 className="text-xl font-playwriteCU !mr-[14px]">Songs</h3>}

                  {isChecked && (
                     <CheckedCta variant={props.variant}>
                        <p className="font-playwriteCU mr-1">{selectedSongs.length}</p>

                        <Button
                           onClick={addSongsToQueue}
                           variant={"outline"}
                           size="small"
                           className={classes.outlineButton}
                        >
                           <PlusIcon className={classes.icon} />
                           <span className="hidden sm:block">Add to queue</span>
                        </Button>
                     </CheckedCta>
                  )}
               </>
            );

         case "dashboard-songs":
            return (
               <>
                  {!isChecked && children}
                  {isChecked && (
                     <CheckedCta variant={props.variant}>
                        <p className="font-playwriteCU">{selectedSongs.length}</p>

                        <Button
                           variant={"outline"}
                           size="small"
                           onClick={() => console.log("confirm modal")}
                           className={classes.outlineButton}
                        >
                           <TrashIcon className={classes.icon} />
                           <span className="hidden sm:block">Delete</span>
                        </Button>
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
                        variant={props.variant}
                     >
                        <p className="font-playwriteCU !mr-[14px]">{selectedSongs.length}</p>

                        <Button
                           variant={"outline"}
                           size="small"
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           <PlusIcon className={classes.icon} />
                           <span className="hidden sm:block">Add to queue</span>
                        </Button>

                        <Button
                           variant={"outline"}
                           size="small"
                           onClick={() => setIsOpenModal("delete-selected-songs")}
                           className={classes.outlineButton}
                        >
                           <TrashIcon className={classes.icon} />
                           <span className="hidden sm:block">Delete</span>
                        </Button>
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
                        variant={props.variant}
                     >
                        <p className="font-playwriteCU !mr-[14px]">{selectedSongs.length}</p>
                        {props.variant !== "dashboard-playlist" && (
                           <Button
                              variant={"outline"}
                              size="small"
                              onClick={addSongsToQueue}
                              className={classes.outlineButton}
                           >
                              <PlusIcon className={classes.icon} />
                              Add to songs queue
                           </Button>
                        )}

                        <Button
                           variant={"outline"}
                           size="small"
                           onClick={() => setIsOpenModal("remove-selects-songs")}
                           className={classes.outlineButton}
                        >
                           <MinusIcon className={classes.icon} />
                           Remove
                        </Button>
                     </CheckedCta>
                  )}
               </>
            );
         case "admin-playlist":
            return (
               <>
                  {!isChecked && <h3 className="font-playwriteCU text-xl !mr-[14px]">Songs</h3>}

                  {isChecked && (
                     <CheckedCta
                        selectAll={handleSelectAllPlaylistSongs}
                        variant={props.variant}
                     >
                        <p className="font-[500]">{selectedSongs.length}</p>

                        <Button
                           variant={"outline"}
                           size="small"
                           onClick={addSongsToQueue}
                           className={classes.outlineButton}
                        >
                           <PlusIcon className={classes.icon} />
                           Add to songs queue
                        </Button>
                     </CheckedCta>
                  )}
               </>
            );
      }
   }, [isChecked, selectedSongs, props]);

   return (
      <>
         <div className="flex items-center space-x-2 h-[40px]">
            {content}
         </div>

         {isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

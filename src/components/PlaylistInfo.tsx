import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, useActuallySongsStore, useTheme } from "../store";
import { Button, ConfirmModal, Modal, PlaylistItem, Skeleton } from ".";
import { PencilSquareIcon, PlayIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useMemo, useState } from "react";
import { SongIn, setSong } from "../store/SongSlice";
import { useParams } from "react-router-dom";
import EditPlaylist from "./modals/EditPlaylist";
import usePlaylistActions from "../hooks/usePlaylistActions";
import { usePlaylistContext } from "../store/PlaylistSongContext";
import { handleTimeText } from "../utils/appHelpers";

type Modal = "edit" | "delete";

type MyPlaylist = {
   type: "my-playlist";
   loading: boolean;
};

type AdminPlaylist = {
   type: "admin-playlist";
   loading: boolean;
};

type Props = MyPlaylist | AdminPlaylist;

export default function PLaylistInfo({ loading, type }: Props) {
   // store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { playlistSongs } = usePlaylistContext();
   const { setActuallySongs } = useActuallySongsStore();
   const { playlist: playlistInStore, song: songInStore } =
      useSelector(selectAllSongStore);

   // state
   const [isOpenModal, setIsOpenModal] = useState<Modal | "">("");

   // hooks
   const params = useParams();
   const { deletePlaylist, isFetching } = usePlaylistActions();

   const isOnMobile = useMemo(() => window.innerWidth < 800, []);

   const closeModal = () => setIsOpenModal("");

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

   const handlePlayPlaylist = () => {
      const firstSong = playlistSongs[0];

      if (songInStore.song_in.includes(params.name as string)) return;
      handleSetSong(firstSong, 0);
   };

   const handleDeletePlaylist = async () => {
      try {
         await deletePlaylist(playlistInStore);

         const audioEle = document.querySelector(".hd-mp3") as HTMLAudioElement;
         if (audioEle) audioEle.pause();
      } catch (error) {
         console.log(error);
      }
   };

   const playlistInfoSkeleton = (
      <>
         <Skeleton className="h-[30px]  w-[200px]" />
         <Skeleton className="hidden md:block h-[16px] w-[60px]" />
         <Skeleton className="hidden md:block h-[16px] w-[200px]" />
      </>
   );

   const renderInfo = useMemo(() => {
      if (loading) return playlistInfoSkeleton;

      return (
         <>
            <h1 className="text-[30px] font-semibold leading-[1]">
               {playlistInStore.name}
            </h1>
            {!isOnMobile && (
               <p className="text-[16px] leading-[1]">
                  {handleTimeText(playlistInStore?.time)}
               </p>
            )}
            <p className="hidden md:block opacity-60 leading-[1]">
               create by {playlistInStore.by}
            </p>
         </>
      );
   }, [loading]);

   const renderCta = useMemo(() => {
      if (loading) return <></>;

      switch (type) {
         case "my-playlist":
            return (
               <>
                  <Button
                     onClick={handlePlayPlaylist}
                     className={`rounded-full px-[20px] py-[6px] ${theme.content_bg} ${
                        !playlistInStore.song_ids.length &&
                        "opacity-60 pointer-events-none"
                     }`}
                  >
                     <PlayIcon className="mr-[5px] w-[22px]" />
                     Play
                  </Button>
                  <Button
                     onClick={() => setIsOpenModal("delete")}
                     className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
                  >
                     <TrashIcon className="w-[22px]" />
                  </Button>

                  <Button
                     onClick={() => setIsOpenModal("edit")}
                     className={`p-[8px] rounded-full ${theme.content_hover_bg} bg-${theme.alpha}`}
                  >
                     <PencilSquareIcon className="w-[22px]" />
                  </Button>
               </>
            );
         case "admin-playlist":
            return (
               <Button
                  onClick={handlePlayPlaylist}
                  className={`rounded-full px-[20px] py-[6px] ${theme.content_bg} ${
                     !playlistInStore.song_ids.length && "opacity-60 pointer-events-none"
                  }`}
               >
                  <PlayIcon className="mr-[5px] w-[22px]" />
                  Play
               </Button>
            );
      }
   }, [loading]);

   const renderModal = useMemo(() => {
      switch (isOpenModal) {
         case "":
            return <></>;
         case "edit":
            return <EditPlaylist close={closeModal} playlist={playlistInStore} />;

         case "delete":
            return (
               <ConfirmModal
                  loading={isFetching}
                  label={"Delete playlist ?"}
                  theme={theme}
                  callback={handleDeletePlaylist}
                  close={closeModal}
               />
            );
      }
   }, [isOpenModal, isFetching]);

   const classes = {
      container:
         "w-full space-y-[12px] md:space-y-0 md:space-x-[12px] flex flex-col md:flex-row",
      playlistInfoContainer: `flex flex-col gap-[12px] md:justify-between`,
      infoTop: "flex justify-center items-center gap-[8px] md:flex-col md:items-start",
      countSongText: "text-[14px]] font-semibold opacity-[.6] leading-[1]",
      ctaContainer: `flex justify-center space-x-[12px] md:justify-start`,
   };

   return (
      <>
         <div className={classes.container}>
            {/* image */}
            <div className="w-full px-[20px] md:w-1/4 md:px-0">
               {loading ? (
                  <Skeleton className="pt-[100%] rounded-[8px]" />
               ) : (
                  <PlaylistItem
                     data={playlistInStore}
                     active={songInStore.song_in === `playlist_${playlistInStore.id}`}
                     inDetail
                     theme={theme}
                  />
               )}
            </div>

            {/* desktop playlist info */}
            <div className={classes.playlistInfoContainer}>
               <div className={classes.infoTop}>{renderInfo}</div>

               {/* cta */}
               <div className={`${classes.ctaContainer} `}>{renderCta}</div>
            </div>
         </div>

         {!!isOpenModal && <Modal closeModal={closeModal}>{renderModal}</Modal>}
      </>
   );
}

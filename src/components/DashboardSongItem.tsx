import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Song, ThemeType } from "../types";

import { Button, Image, PopupWrapper, Modal, SongItemEditForm } from ".";
import { confirmModal } from "./Modal";

import { useToast } from "../store/ToastContext";
import { selectAllSongStore } from "../store/SongSlice";
import { useSelector } from "react-redux";
// import { initSongObject } from "../utils/appHelpers";

import { deleteSong } from "../utils/firebaseHelpers";

type Props = {
   data: Song;
   isChecked?: boolean;
   theme: ThemeType & { alpha: string };

   selectedSongList?: Song[];
   setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;

   setAdminSongs?: Dispatch<SetStateAction<Song[]>>;
   adminSongs?: Song[];
   inProcess: boolean;
};

export default function AdminSongItem({
   data,
   theme,
   selectedSongList,
   setSelectedSongList,
   isChecked,
   adminSongs,
   setAdminSongs,
   inProcess,
}: Props) {
   const [loading, setLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<string>();

   // use hooks
   // const dispatch = useDispatch();
   const { setErrorToast, setSuccessToast } = useToast();
   const { song: songInStore } = useSelector(selectAllSongStore);

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
   };

   const handleDeleteSong = async () => {
      if (!setAdminSongs ||  !adminSongs) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

      try {
         setLoading(true);

         const newAdminSongs = [...adminSongs]

         // eliminate 1 song
         const index = newAdminSongs.indexOf(data);
         newAdminSongs.splice(index, 1);

         // >>> local
         setAdminSongs(newAdminSongs)

         // >>> api
         await deleteSong(data);

         // >>> finish
         setSuccessToast({ message: `'${data.name}' deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({});
      } finally {
         closeModal();
      }
   };

   const handleSelect = (song: Song) => {
      if (!selectedSongList || !setSelectedSongList) return;

      let list = [...selectedSongList];

      const index = list.indexOf(song);

      // if no present
      if (index === -1) {
         list.push(song);

         // if present
      } else {
         list.splice(index, 1);
      }
      setSelectedSongList(list);
   };

   const dialogComponent = useMemo(
      () =>
         confirmModal({
            loading: loading,
            label: `Delete '${data.name}'`,
            desc: "This action cannot be undone",
            theme: theme,
            callback: handleDeleteSong,
            setOpenModal: setIsOpenModal,
         }),
      [loading, theme, adminSongs, songInStore]
   );

   const classes = {
      td: `py-[10px] my-[10px] border-${theme.alpha} border-b-[1px]`,
      th: `py-[5px]`,
   };

   return (
      <>
         <tr className={``}>
            <td className={`${classes.td} text-center`}>
               {!inProcess && (
                  <input
                     checked={isChecked}
                     onChange={() => handleSelect(data)}
                     className="scale-[1.2]"
                     type="checkbox"
                  />
               )}
            </td>
            <td className={classes.td}>
               <div className="h-[44px] w-[44px]">
                  <Image classNames="" src={data.image_url} />
               </div>
            </td>
            <td className={classes.td}>{data.name}</td>
            <td className={classes.td}>{data.singer}</td>

            {inProcess ? (
               <td className={classes.td}>
                  <h1>...in process</h1>
               </td>
            ) : (
               <td className={classes.td}>
                  <div className="flex items-center gap-[5px]">
                     <Button variant={"circle"} onClick={() => handleOpenModal("confirm")}>
                        <TrashIcon className="w-[20px]" />
                     </Button>
                     <Button variant={"circle"} onClick={() => handleOpenModal("edit")}>
                        <PencilSquareIcon className="w-[20px]" />
                     </Button>
                  </div>
               </td>
            )}
         </tr>

         {isOpenModal && !inProcess && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>
                  {modalComponent === "edit" && (
                     <SongItemEditForm
                        setIsOpenModal={setIsOpenModal}
                        setUserSongs={setAdminSongs}
                        theme={theme}
                        userSongs={adminSongs}
                        data={data}
                     />
                  )}
                  {modalComponent === "confirm" && dialogComponent}
               </PopupWrapper>
            </Modal>
         )}
      </>
   );
}

import { DocumentIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, forwardRef, useState } from "react";
import { Song, ThemeType } from "../types";

import { Button, ConfirmModal, Modal, SongItemEditForm } from ".";

import { useToast } from "../store/ToastContext";

import { deleteSong } from "../utils/firebaseHelpers";
import { Link } from "react-router-dom";
import { routes } from "../routes";

type Props = {
   data: Song;
   isChecked?: boolean;
   theme: ThemeType & { alpha: string };

   selectedSongList?: Song[];
   setSelectedSongList?: Dispatch<SetStateAction<Song[]>>;

   setAdminSongs?:(adminSongs: Song[]) => void;
   adminSongs?: Song[];
   inProcess: boolean;
};

const DashboardSongItem = (
   {
      data,
      theme,
      selectedSongList,
      setSelectedSongList,
      isChecked,
      adminSongs,
      setAdminSongs,
      inProcess,
   }: Props,
   ref: any
) => {
   const [loading, setLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState(false);
   const [modalComponent, setModalComponent] = useState<string>();

   const { setErrorToast, setSuccessToast } = useToast();

   const handleOpenModal = (name: string) => {
      setModalComponent(name);
      setIsOpenModal(true);
   };

   const closeModal = () => {
      setLoading(false);
      setIsOpenModal(false);
   };

   const handleDeleteSong = async () => {
      if (!setAdminSongs || !adminSongs) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

      try {
         setLoading(true);

         const newAdminSongs = [...adminSongs];

         // eliminate 1 song
         const index = newAdminSongs.indexOf(data);
         newAdminSongs.splice(index, 1);
  
         // >>> api
         await deleteSong(data);

         // >>> local
         setAdminSongs(newAdminSongs);

         // >>> finish
         setSuccessToast({ message: `'${data.name}' deleted` });
      } catch (error) {
         console.log({ message: error });
         setErrorToast({message: 'Error when delete song'});
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

   const classes = {
      td: `py-[10px] my-[10px] border-${theme.alpha} border-b-[1px]`,
      th: `py-[5px]`,
   };

   return (
      <>
         <tr ref={ref} className={``}>
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
                  <img className="rounded-[4px]" src={data.image_url} />
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
                     <Button
                        variant={"circle"}
                        onClick={() => handleOpenModal("confirm")}
                     >
                        <TrashIcon className="w-[20px]" />
                     </Button>
                     <Button variant={"circle"} onClick={() => handleOpenModal("edit")}>
                        <PencilSquareIcon className="w-[20px]" />
                     </Button>
                     <Link to={`${routes.Dashboard}/edit/${data.id}`}>
                        <Button
                           variant={"circle"}
                           onClick={() => handleOpenModal("edit")}
                        >
                           <DocumentIcon className="w-[20px]" />
                        </Button>
                     </Link>
                  </div>
               </td>
            )}
         </tr>

         {isOpenModal && !inProcess && (
            <Modal theme={theme} setOpenModal={setIsOpenModal}>
               {modalComponent === "edit" && (
                  <SongItemEditForm
                     setIsOpenModal={setIsOpenModal}
                     setUserSongs={setAdminSongs}
                     theme={theme}
                     userSongs={adminSongs}
                     data={data}
                  />
               )}
               {modalComponent === "confirm" && (
                  <ConfirmModal
                     loading={loading}
                     label={`Delete '${data.name}'`}
                     desc={"This action cannot be undone"}
                     theme={theme}
                     callback={handleDeleteSong}
                     setOpenModal={setIsOpenModal}
                  />
               )}
            </Modal>
         )}
      </>
   );
};

export default forwardRef(DashboardSongItem);

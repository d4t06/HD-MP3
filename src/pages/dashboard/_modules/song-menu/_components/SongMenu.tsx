import { ConfirmModal, Modal, ModalRef } from "@/components";
import { usePopoverContext } from "@/components/MyPopup";
import useDashboardSongItemAction, { SongItemActionProps } from "@/pages/dashboard/_hooks/useSongItemAction";
import { useRef, useState } from "react";
import { DashboardSongMenuWrapper } from "..";
import { Link } from "react-router-dom";
import { AdjustmentsHorizontalIcon, DocumentTextIcon, TrashIcon } from "@heroicons/react/24/outline";


type SongsMenuModal = "edit" | "delete";


export default function SongMenu({ song }: { song: Song }) {
   const { close } = usePopoverContext();
   const { actions, isFetching } = useDashboardSongItemAction();
 
   const [modal, setModal] = useState<SongsMenuModal | "">("");
 
   const modalRef = useRef<ModalRef>(null);
 
   const closeModal = () => modalRef.current?.close();
   const openModal = (m: SongsMenuModal) => {
     setModal(m);
 
     close();
     modalRef.current?.open();
   };
 
   const handleSongAction = async (props: SongItemActionProps) => {
     switch (props.variant) {
       case "delete":
         await actions({ variant: "delete", song });
     }
 
     closeModal();
   };
 
   const renderModal = () => {
     switch (modal) {
       case "":
         return <></>;
       case "edit":
       case "delete":
         return (
           <ConfirmModal
             loading={isFetching}
             label={`Delete '${song.name}' ?`}
             desc={"This action cannot be undone"}
             callback={() =>
               handleSongAction({
                 variant: "delete",
                 song,
               })
             }
             close={closeModal}
           />
         );
     }
   };
 
   return (
     <>
       <DashboardSongMenuWrapper song={song}>
         <Link to={`/dashboard/song/${song.id}/edit`}>
           <AdjustmentsHorizontalIcon className={`w-5`} />
           <span>Edit</span>
         </Link>
         <Link to={`/dashboard/lyric/${song.id}`}>
           <DocumentTextIcon className={`w-5`} />
 
           <span>Lyric</span>
         </Link>
         <button onClick={() => openModal("delete")}>
           <TrashIcon className={`w-5`} />
 
           <span>Delete</span>
         </button>
       </DashboardSongMenuWrapper>
 
       <Modal ref={modalRef} variant="animation">
         {renderModal()}
       </Modal>
     </>
   );
 }
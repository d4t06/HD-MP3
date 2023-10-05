import { PauseCircleIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { FC, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { nanoid } from "nanoid";
import { routes } from "../../routes";
import { Playlist, ThemeType, User } from "../../types";

import { myDeleteDoc, setUserPlaylistIdsDoc } from "../../utils/firebaseHelpers";
import { useToast } from "../../store/ToastContext";

import Modal, { confirmModal } from "../Modal";
import Button from "./Button";
import PopupWrapper from "./PopupWrapper";
import Image from "./Image";

interface Props {
   data: Playlist;
   theme: ThemeType & { alpha: string };
   inDetail?: boolean;
   userPlaylists: Playlist[];
   userData: User;
   setUserPlaylists: (playlist: Playlist[], adminPlaylists: Playlist[]) => void;
   onClick?: () => void;
}

const PlaylistItem: FC<Props> = ({
   data,
   inDetail,
   theme,
   userPlaylists,
   userData,
   setUserPlaylists,
   onClick,
}) => {
   const navigate = useNavigate();
   const { setToasts } = useToast();

   const [fBaseLoading, setFBaseLoading] = useState(false);
   const [isOpenModal, setIsOpenModal] = useState<boolean>(false);

   const handleDeletePlaylist = async () => {
      setFBaseLoading(true);

      try {
         // delete playlist doc
         await myDeleteDoc({ collection: "playlist", id: data.id });

         const newUserPlaylists = [...userPlaylists];

         // eliminate 1 element from playlists
         newUserPlaylists.splice(newUserPlaylists.indexOf(data), 1);

         // update user doc
         await setUserPlaylistIdsDoc(newUserPlaylists, userData);

         // update user playlists context
         setUserPlaylists(newUserPlaylists, []);

         setToasts((t) => [
            ...t,
            {
               title: "success",
               id: nanoid(4),
               desc: `Playlist '${data.name}' deleted`,
            },
         ]);

         setFBaseLoading(false);
         setIsOpenModal(false);

         if (inDetail) {
            navigate(`${routes.Playlist}`);
         }
      } catch (error) {
         setToasts((t) => [
            ...t,
            {
               title: "error",
               id: nanoid(4),
               desc: `Playlist '${data.name}' Somethings went wrong`,
            },
         ]);
      }
   };

   const confirmComponent = useMemo(
      () =>
         confirmModal({
            callback: handleDeletePlaylist,
            label: "Wait a minute",
            loading: fBaseLoading,
            setOpenModal: setIsOpenModal,
            theme: theme,
         }),
      [fBaseLoading, theme]
   );

   const classes = {
      button: `rounded-full text-[#fff] p-[4px] hover:bg-${theme.alpha}`,
      imageContainer: `relative overflow-hidden rounded-xl flex-grow`,
      absoluteContainer: "absolute hidden inset-0 group-hover:block",
      overlay: "absolute inset-0 bg-[#333] opacity-60",
      buttonContainer: "justify-center items-center h-full relative z-10 relative",
      buttonWrapper:
         "flex absolute right-[50%] translate-x-[25%] top-[50%] translate-y-[-50%] gap-[12px]",
   };
   const isOnMobile = useMemo(() => {
      return window.innerWidth < 550;
   }, []);

   return (
      <>
         <div className="group h-full flex flex-col" onClick={() => isOnMobile && onClick && onClick()}>
            <div className={classes.imageContainer}>
               <Image src={data.image_url} />

               {!isOnMobile && !inDetail && (
                  <div className={classes.absoluteContainer}>
                     <div className={classes.overlay}></div>

                     <div className={classes.buttonWrapper}>
                        <Button
                           onClick={() => setIsOpenModal(true)}
                           className={classes.button}
                        >
                           <XMarkIcon className="w-[35px]" />
                        </Button>

                        <Button
                           onClick={() => onClick && onClick()}
                           className={classes.button}
                        >
                           <PauseCircleIcon className="w-[35px]" />
                        </Button>
                     </div>
                  </div>
               )}
            </div>
            {!inDetail && (
               <h5 className="text-[20px] font-[500] mt-[5px]">{data.name}</h5>
            )}
         </div>

         {isOpenModal && (
            <Modal setOpenModal={setIsOpenModal}>
               <PopupWrapper theme={theme}>{confirmComponent}</PopupWrapper>
            </Modal>
         )}
      </>
   );
};

export default PlaylistItem;

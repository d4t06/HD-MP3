import { Dispatch, SetStateAction, useState } from "react";
import ModalHeader from "./ModalHeader";
import { ThemeType, User } from "../../types";
import { Button } from "..";
import usePlaylistActions from "../../hooks/usePlaylistActions";

type Props = {
   setIsOpenModal: Dispatch<SetStateAction<boolean>>;
   theme: ThemeType & { alpha: string };
   admin?: boolean;
   userInfo?: User;
   cb?: () => void;
};
export default function AddPlaylist({ setIsOpenModal, theme, admin, cb }: Props) {
   const [playlistName, setPlayListName] = useState<string>("");
   const { addPlaylist, loading } = usePlaylistActions({ admin });

   const handleAddPlaylist = async () => {
      try {
         await addPlaylist(playlistName);
      } catch (error) {
         console.log("error");
      } finally {
         setIsOpenModal(false);
      }
   };

   return (
      <div className="w-[300px]">
         <ModalHeader setIsOpenModal={setIsOpenModal} title="Add playlist" />
         <input
            className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
            type="text"
            placeholder="name..."
            value={playlistName}
            onChange={(e) => setPlayListName(e.target.value)}
         />

         <p className="text-right mt-[20px]">
            <Button
               isLoading={loading}
               onClick={() => handleAddPlaylist()}
               variant={"primary"}
               className={`${theme.content_bg} rounded-full`}
            >
               Save
            </Button>
         </p>
      </div>
   );
}

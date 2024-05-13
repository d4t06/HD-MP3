import { FormEvent, useEffect, useState, useRef } from "react";
import ModalHeader from "./ModalHeader";
import { Button } from "..";
import { useTheme } from "../../store";

type Props = {
   close: () => void;
   isFetching: boolean;
   addPlaylist: (name: string) => Promise<void>;
};

export default function AddPlaylist({ close, addPlaylist, isFetching }: Props) {
   const { theme } = useTheme();

   const [playlistName, setPlayListName] = useState<string>("");

   // hooks
   const inputRef = useRef<HTMLInputElement>(null);

   const handleAddPlaylist = async (e: FormEvent) => {
      e.preventDefault();
      if (!playlistName) return;

      await addPlaylist(playlistName);
      close();
   };

   useEffect(() => {
      inputRef.current?.focus();
   }, []);

   return (
      <div className="w-[300px] max-w-[calc(100vw-40px)]:">
         <ModalHeader close={close} title="Add playlist" />
         <form action="" onSubmit={handleAddPlaylist}>
            <input
               ref={inputRef}
               className={`bg-${theme.alpha} px-[20px] rounded-full outline-none mt-[10px] text-[16px]  h-[35px] w-full`}
               type="text"
               placeholder="name..."
               value={playlistName}
               onChange={(e) => setPlayListName(e.target.value)}
            />

            <p className="text-right mt-[20px]">
               <Button
                  type="submit"
                  isLoading={isFetching}
                  variant={"primary"}
                  className={`${theme.content_bg} rounded-full ${
                     !playlistName ? "opacity-[.6] pointer-events-none" : ""
                  }`}
               >
                  Save
               </Button>
            </p>
         </form>
      </div>
   );
}

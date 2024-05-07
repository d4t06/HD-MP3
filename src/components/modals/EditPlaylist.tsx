import { useState, useEffect, useRef, FormEvent } from "react";
import usePlaylistActions from "../../hooks/usePlaylistActions";
import { useTheme } from "../../store";
import { Button } from "..";
import ModalHeader from "./ModalHeader";

type Props = {
   playlist: Playlist;
   close: () => void;
};

export default function EditPlaylist({ playlist, close }: Props) {
   const { theme } = useTheme();
   const inputRef = useRef<HTMLInputElement>(null);
   const [playlistName, setPlaylistName] = useState<string>("");
   const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

   const { editPlaylist, isFetching } = usePlaylistActions();

   const handleEditPlaylist = async (e: FormEvent) => {
      e.preventDefault();
      if (!isAbleToSubmit) return;

      try {
         await editPlaylist(playlistName, playlist);
      } catch (error) {
         console.log(error);
      } finally {
         close();
      }
   };

   const classes = {
      editContainer: "w-[400px] max-w-[calc(90vw-40px)]",
      input: "text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full",
   };

   useEffect(() => {
      const inputEle = inputRef.current;
      inputEle?.focus();

      setPlaylistName(playlist.name);
   }, []);

   useEffect(() => {
      if (playlistName.trim() && playlistName.trim() !== playlist.name)
         setIsAbleToSubmit(true);
      else setIsAbleToSubmit(false);
   }, [playlistName]);

   return (
      <>
         <ModalHeader close={close} title="Edit playlist" />
         <form
            action=""
            onSubmit={handleEditPlaylist}
            className={`${classes.editContainer} ${
               isFetching ? "opacity-60 pointer-events-none" : ""
            }`}
         >
            <input
               ref={inputRef}
               value={playlistName}
               onChange={(e) => setPlaylistName(e.target.value)}
               type="text"
               className={`${classes.input} bg-${theme.alpha} ${
                  theme.type === "light" ? "text-[#333]" : "text-white"
               }`}
            />

            <Button
               type="submit"
               variant={"primary"}
               isLoading={isFetching}
               className={`${theme.content_bg} rounded-full self-end mt-[15px] ${
                  isAbleToSubmit ? "" : "opacity-60 pointer-events-none"
               }`}
            >
               Save
            </Button>
         </form>
      </>
   );
}

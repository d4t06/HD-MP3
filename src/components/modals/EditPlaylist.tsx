import { useState, useEffect, useRef, FormEvent, Dispatch, SetStateAction } from "react";
import usePlaylistActions from "../../hooks/usePlaylistActions";
import { useTheme } from "../../store";
import { Playlist } from "../../types";
import { Button } from "..";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import ModalHeader from "./ModalHeader";

export default function EditPlaylist({
  playlist,
  isOpenModal,
  setIsOpenModal,
}: {
  playlist: Playlist;
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}) {
  const { theme } = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [playlistName, setPlaylistName] = useState<string>("");
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);

  const { editPlaylist, loading } = usePlaylistActions({});

  const handleEditPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAbleToSubmit) return;
    
    try {
      await editPlaylist(playlistName, playlist);
    } catch (error) {
      console.log(error);
    } finally {
      setIsOpenModal(false);
    }
  };

  const classes = {
    editContainer: "w-[400px] max-w-[90vw] max-w-[calc(90vw-40px)]",
    input: "text-[20px] rounded-[4px] px-[10px] h-[40px] mb-[15px] outline-none w-full",
  };

  useEffect(() => {
    if (isOpenModal) {
      const inputEle = inputRef.current as HTMLInputElement;
      inputEle.focus();
      setPlaylistName(playlist.name);
    }
  }, [isOpenModal]);

  useEffect(() => {
    if (playlistName.trim() && playlistName.trim() !== playlist.name) setIsAbleToSubmit(true);
    else setIsAbleToSubmit(false);
  }, [playlistName]);

  return (
    <form
      action=""
      onSubmit={handleEditPlaylist}
      className={`${classes.editContainer} ${loading ? "opacity-60 pointer-events-none" : ""}`}
    >
      <ModalHeader setIsOpenModal={setIsOpenModal} title="Edit playlist" />

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
        className={`${theme.content_bg} rounded-full self-end mt-[15px] ${isAbleToSubmit ? '' : 'opacity-60 pointer-events-none'}`}
      >
        {loading ? <ArrowPathIcon className="w-[20px] animate-spin" /> : "Save"}
      </Button>
    </form>
  );
}

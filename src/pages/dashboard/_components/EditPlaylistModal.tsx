import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "../_components/ui";
import { ModalHeader } from "@/components";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";

type Props = {
  playlist: Playlist;
  closeModal: () => void;
};

export default function EditPlaylistModal({ playlist, closeModal }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [playlistName, setPlaylistName] = useState<string>("");

  const { actions, isFetching } = useDashboardPlaylistActions();

  const isAbleToSubmit = useMemo(
    () => playlistName.trim() && playlistName !== playlist.name,
    [playlistName]
  );

  const handleEditPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    if (!isAbleToSubmit) return;

    await actions({ variant: "edit-playlist", name: playlistName });
    closeModal();
  };

  useEffect(() => {
    const inputEle = inputRef.current;
    inputEle?.focus();

    setPlaylistName(playlist.name);
  }, []);

  const classes = {
    container: "w-[400px] max-w-[calc(90vw-40px)]",
    input: "rounded-md px-3 py-2 outline-none w-full bg-white/5 text-white",
  };

  return (
    <>
      <ModalHeader close={closeModal} title="Edit playlist" />
      <form
        action=""
        onSubmit={handleEditPlaylist}
        className={`${classes.container} ${isFetching ? "disable" : ""}`}
      >
        <input
          ref={inputRef}
          value={playlistName}
          onChange={(e) => setPlaylistName(e.target.value)}
          type="text"
          className={`${classes.input}`}
        />

        <Button
          type="submit"
          disabled={!isAbleToSubmit}
          loading={isFetching}
          className="mt-5"
        >
          Save
        </Button>
      </form>
    </>
  );
}

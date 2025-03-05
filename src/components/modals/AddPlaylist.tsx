import { FormEvent, useEffect, useState, useRef } from "react";
import ModalHeader from "../ModalHeader";
import { Button } from "..";
import { useThemeContext } from "@/stores";
import usePlaylistAction from "@/hooks/usePlaylistAction";

type Props = {
  close: () => void;
};

export default function AddPlaylist({ close }: Props) {
  const { theme } = useThemeContext();

  const [playlistName, setPlayListName] = useState<string>("");

  const inputRef = useRef<HTMLInputElement>(null);

  const { action, isFetching } = usePlaylistAction();

  const handleAddPlaylist = async (e: FormEvent) => {
    e.preventDefault();
    if (!playlistName.trim()) return;

    await action({ variant: "add", name: playlistName });
    close();
  };

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-[400px] max-w-[calc(100vw-40px)]">
      <ModalHeader close={close} title="Add playlist" />
      <form action="" onSubmit={handleAddPlaylist}>
        <input
          ref={inputRef}
          className={`bg-[#fff]/5 px-[20px] text-lg rounded-full outline-none  h-[35px] w-full`}
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
            className={`${theme.content_bg} font-playwriteCU rounded-full ${
              !playlistName ? "disable" : ""
            }`}
          >
            Save
          </Button>
        </p>
      </form>
    </div>
  );
}

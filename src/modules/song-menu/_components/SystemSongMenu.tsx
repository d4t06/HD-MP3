import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";
import AddToNewPlaylistMenuItem, {
  AddToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";
import { useRef } from "react";
import { ModalRef } from "@/components";

type Props = {
  song: Song;
  addSongToQueue: () => void;
};

export default function SystemSongMenu({ song, addSongToQueue }: Props) {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>system song menu</p>}
        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>

        <AddToNewPlaylistMenuItem modalRef={modalRef} />

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>

      <AddToPlaylistMenuModal song={song} modalRef={modalRef} />
    </>
  );
}

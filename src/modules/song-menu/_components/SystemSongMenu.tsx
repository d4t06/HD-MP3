import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";
import AddToNewPlaylistMenuItem, {
  AddToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";
import { useRef } from "react";
import { ModalRef } from "@/components";
import AddToQueueMenuItem from "./AddToQueueMenuItem";

type Props = {
  song: Song;
};

export default function SystemSongMenu({ song }: Props) {
  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>system song menu</p>}
        <AddToQueueMenuItem song={song} />

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

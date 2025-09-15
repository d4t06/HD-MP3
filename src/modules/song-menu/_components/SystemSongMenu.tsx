import { SongMenuContent } from "..";
import AddToNewPlaylistMenuItem, {
  AddToPlaylistMenuModal,
} from "./AddToPlaylistMenuItem";
import { useRef } from "react";
import { ModalRef } from "@/components";
import AddToQueueMenuItem from "./AddToQueueMenuItem";
import DownloadSongMenuItem from "./DownloadSongMenuItem";

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

        <DownloadSongMenuItem song={song} />
      </SongMenuContent>

      <AddToPlaylistMenuModal song={song} modalRef={modalRef} />
    </>
  );
}

import { useSongQueueAction } from "@/hooks";
import { ArrowDownTrayIcon, MinusIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";

type Props = {
  song: Song;
  index: number;
};

export default function QueueSongMenu({ song, index }: Props) {
  const { action } = useSongQueueAction();

  //   const addSongToNewPlaylistModalRef = useRef<ModalRef>(null);

  const handleRemoveSongFromQueue = () => {
    action({
      variant: "remove",
      index,
    });
    close();
  };

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>queue song menu</p>}

        <button onClick={handleRemoveSongFromQueue}>
          <MinusIcon className="w-5" />
          <span>Remove</span>
        </button>

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>

        {/* <AddSongToNewPlaylistModal modalRef={addSongToNewPlaylistModalRef} song={song} /> */}
      </SongMenuContent>
    </>
  );
}

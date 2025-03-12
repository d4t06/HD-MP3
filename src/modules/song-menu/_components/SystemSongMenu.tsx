import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";

type Props = {
  song: Song;
  addSongToQueue: () => void;
};

export default function SystemSongMenu({ song, addSongToQueue }: Props) {
  // const addSongToNewPlaylistModalRef = useRef<ModalRef>(null);
  // const addSongToPlaylistModalRef = useRef<ModalRef>(null);

  return (
    <>
      <SongMenuContent song={song}>
        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>
        {/* 
      <AddToPlaylistMenuItem
        song={song}
        addSongToPlaylistModalRef={addSongToPlaylistModalRef}
        addSongToNewPlaylistModalRef={addSongToNewPlaylistModalRef}
      /> */}

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>
    </>
  );
}

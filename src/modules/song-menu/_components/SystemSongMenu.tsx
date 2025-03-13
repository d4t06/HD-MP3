import { ArrowDownTrayIcon, PlusIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";

type Props = {
  song: Song;
  addSongToQueue: () => void;
};

export default function SystemSongMenu({ song, addSongToQueue }: Props) {
  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>system song menu</p>}
        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>
    </>
  );
}

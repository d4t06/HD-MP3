import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  MinusIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";
import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";

type Props = {
  addSongToQueue: () => void;
  song: Song;
};

export default function OwnPlaylistMenu({ addSongToQueue, song }: Props) {
  const { isFetching } = usePlaylistAction();

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>own playlist menu</p>}

        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>

        <button>
          {!isFetching ? (
            <>
              <MinusIcon className="w-5" />
              <span>Remove</span>
            </>
          ) : (
            <ArrowPathIcon className="w-5 animate-spin" />
          )}
        </button>

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>
    </>
  );
}

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
  const { isFetching, removeSelectSongs } = usePlaylistAction();

  return (
    <>
      <SongMenuContent song={song}>
        <button onClick={addSongToQueue}>
          <PlusIcon className="w-5" />
          <span>Add to queue</span>
        </button>

        <button onClick={() => removeSelectSongs([song])}>
          {!isFetching ? (
            <>
              <MinusIcon className="w-5" />
              <span>Edit</span>
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

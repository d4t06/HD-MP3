import { ArrowDownTrayIcon, ArrowPathIcon, MinusIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";
import usePlaylistAction from "@/modules/playlist-info/_hooks/usePlaylistAction";
import AddToQueueMenuItem from "./AddToQueueMenuItem";

type Props = {
  song: Song;
};

export default function OwnPlaylistMenu({ song }: Props) {
  const { isFetching } = usePlaylistAction();

  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>own playlist menu</p>}

        <AddToQueueMenuItem song={song} />

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

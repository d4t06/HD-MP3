import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { SongMenuContent } from "..";
import AddToQueueMenuItem from "./AddToQueueMenuItem";
import RemoveSongFromPlaylistMenuItem from "./RemoveSongFromPlaylistMenuItem";

type Props = {
  song: Song;
};

export default function OwnPlaylistMenu({ song }: Props) {
  return (
    <>
      <SongMenuContent song={song}>
        {import.meta.env.DEV && <p>own playlist menu</p>}

        <AddToQueueMenuItem song={song} />

        <RemoveSongFromPlaylistMenuItem song={song} />

        <a target="_blank" href={song.song_url}>
          <ArrowDownTrayIcon className="w-5" />
          <span>Download</span>
        </a>
      </SongMenuContent>
    </>
  );
}

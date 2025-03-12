import { useAuthContext } from "@/stores";
import SongItem from "..";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";

type Props = {
  songs: Song[];
  setSong: (song: Song) => void;
};

export default function SongList({ songs, setSong }: Props) {
  const { user } = useAuthContext();
  const { currentSongData } = useSelector(selectSongQueue);

  return songs.map((song, index) => {
    return (
      <SongItem
        active={song.queue_id === currentSongData?.song.queue_id}
        onClick={() => setSong(song)}
        variant={"queue-song"}
        isHasCheckBox
        isLiked={user ? user.liked_song_ids.includes(song.id) : null}
        song={song}
        index={index}
        key={song.queue_id}
      />
    );
  });
}

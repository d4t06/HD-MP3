import { useAuthContext } from "@/stores";
import SongItem from "..";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { ComponentProps } from "react";

type Props = {
  songs: Song[];
  setSong: (song: Song) => void;
  getActive?: (song: Song, currentSong: Song) => boolean;
  songVariant?: ComponentProps<typeof SongItem>["variant"];
};

export default function SongList({ songs, setSong, getActive, songVariant }: Props) {
  const { user } = useAuthContext();
  const { currentSongData } = useSelector(selectSongQueue);

  return songs.map((song, index) => {
    const isOwnSong = user
      ? song.owner_email === user.email && song.is_official === false
      : false;

    return (
      <SongItem
        active={
          currentSongData
            ? getActive
              ? getActive(song, currentSongData.song)
              : song.id === currentSongData.song.id
            : false
        }
        onClick={() => setSong(song)}
        variant={songVariant || isOwnSong ? "own-song" : "system-song"}
        isHasCheckBox
        isLiked={user ? user.liked_song_ids.includes(song.id) : null}
        song={song}
        index={index}
        key={song.queue_id}
      />
    );
  });
}

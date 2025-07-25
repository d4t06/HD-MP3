import { useAuthContext } from "@/stores";
import SongItem from "..";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { ComponentProps } from "react";
import { NotFound } from "@/components";

type Props = {
  songs: Song[];
  setSong: (song: Song) => void;
  getActive?: (song: Song, currentSong: Song) => boolean;
  songVariant?: ComponentProps<typeof SongItem>["variant"];
  isHasCheckBox?: boolean;
  showIndex?: boolean;
  imageUrl?: string;
};

export default function SongList({
  songs,
  setSong,
  getActive,
  songVariant,
  imageUrl,
  showIndex,
  isHasCheckBox = true,
}: Props) {
  const { user } = useAuthContext();
  const { currentSongData } = useSelector(selectSongQueue);

  if (!songs.length) return <NotFound variant="less" />;

  return songs.map((song, index) => {
    const isOwnSong = user
      ? song.owner_email === user.email && song.is_official === false
      : false;

    return (
      <SongItem
        showIndex={showIndex}
        active={
          currentSongData
            ? getActive
              ? getActive(song, currentSongData.song)
              : song.id === currentSongData.song.id
            : false
        }
        onClick={() => setSong(song)}
        variant={songVariant || (isOwnSong ? "own-song" : "system-song")}
        isHasCheckBox={isHasCheckBox}
        isLiked={user ? user.liked_song_ids.includes(song.id) : null}
        song={song}
        imageUrl={imageUrl}
        index={index}
        key={song.queue_id}
      />
    );
  });
}

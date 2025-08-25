import { useAuthContext } from "@/stores";
import SongItem from "..";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { ComponentProps, ReactNode } from "react";
import { NotFound } from "@/components";

type Props = {
  songs: Song[];
  setSong: (song: Song) => void;
  getActive?: (song: Song, currentSong: Song) => boolean;
  songVariant?: ComponentProps<typeof SongItem>["variant"];
  isHasCheckBox?: boolean;
  imageUrl?: string;
  whenEmpty?: ReactNode;
};

export default function SongList({
  songs,
  setSong,
  getActive,
  songVariant,
  imageUrl,
  isHasCheckBox = true,
  whenEmpty,
}: Props) {
  const { user } = useAuthContext();
  const { currentSongData } = useSelector(selectSongQueue);

  if (!songs.length) return whenEmpty || <NotFound variant="less" />;

  const content = songs.map((song, index) => {
    const isOwnSong = user
      ? song.owner_email === user.email && song.is_official === false
      : false;

    return (
      <SongItem
        key={song.queue_id}
        active={
          currentSongData
            ? getActive
              ? getActive(song, currentSongData.song)
              : song.id === currentSongData.song.id
            : false
        }
        onClick={() => setSong(song)}
        variant={songVariant || (isOwnSong ? "own-song" : "system-song")}
        isLiked={user ? user.liked_song_ids.includes(song.id) : null}
        song={song}
        imageUrl={imageUrl}
        index={index}
        isHasCheckBox={isHasCheckBox}
      />
    );
  });

  return content;
}

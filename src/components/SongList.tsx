import { useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";
// import useCurrentSong from "@/hooks/useCurrentSong";

type Base = {
  handleSetSong: (queueId: string) => void;
  songs: Song[];
};

type Home = Base & {
  variant: "home";
};

type MySong = Base & {
  variant: "my-songs";
  tempSongs: Song[];
};

type DashboardSong = Base & {
  variant: "dashboard-songs";
  tempSongs: Song[];
};

type DashboardPlaylist = Base & {
  variant: "dashboard-playlist";
};

type Favorite = Base & {
  variant: "favorite";
};

type Queue = Base & {
  variant: "queue";
};

type AdminPlaylist = Base & {
  variant: "admin-playlist";
};

type MyPlaylist = Base & {
  variant: "my-playlist";
};

type Uploading = {
  songs: Song[];
  variant: "uploading";
};

type Props =
  | Home
  | MySong
  | DashboardSong
  | DashboardPlaylist
  | MyPlaylist
  | AdminPlaylist
  | Queue
  | Favorite
  | Uploading;

function SongList({ songs, ...props }: Props) {
  // store
  const { theme } = useTheme();
  const { queueSongs, currentSongData } = useSelector(selectSongQueue);
  // const { songData, queueSongs } = useCurrentSong();

  const renderTempSongsList = () => {
    if (props.variant !== "uploading") return <></>;

    return songs.map((song, index) => {
      const songItemProps = {
        key: index,
        onClick: () => {},
        song: song as Song,
      };

      if (index == 0)
        return <SongItem variant="uploading" className="temp-song" {...songItemProps} />;

      return <SongItem variant="uploading" {...songItemProps} />;
    });
  };

  const empty = <p className="text-center my-[60px]">... ¯\_(ツ)_/¯</p>;

  const renderSongList = () => {
    if (props.variant === "uploading") return <></>;

    switch (props.variant) {
      case "my-songs":
        if (!songs.length && !props.tempSongs.length) return empty;
        break;
      default:
        if (!songs.length) return empty;
    }

    const { handleSetSong } = props;

    return songs.map((song, index) => {
      const active = song.id === currentSongData?.song.id;

      const isLastIndexInQueue = index === queueSongs.length - 1;

      if (props.variant === "queue" && active && !isLastIndexInQueue) {
        return (
          <div key={song.id + song.name.length + index}>
            <SongItem
              active={active}
              onClick={() => handleSetSong(song.queue_id)}
              variant={props.variant}
              song={song}
              index={index}
            />

            <div className="mt-[12px] mb-[4px]">
              <p className={`${theme.content_text} text-[14px] font-[600]`}>
                Playing next
              </p>
            </div>
          </div>
        );
      }

      return (
        <SongItem
          active={active}
          onClick={() => handleSetSong(song.queue_id)}
          variant={props.variant}
          song={song}
          index={index}
          key={song.id + song.name.length + index}
        />
      );
    });
  };

  return (
    <>
      {renderSongList()}
      {renderTempSongsList()}
    </>
  );
}

export default SongList;

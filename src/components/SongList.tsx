import { useTheme } from "../store";
import { SongItem } from ".";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/store/songQueueSlice";

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

type DashboardSong = Omit<Base, "handleSetSong"> & {
  variant: "dashboard-songs";
  tempSongs: Song[];
  handleSetSong: (song: Song) => void;
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
    switch (props.variant) {
      case "uploading":
        return <></>;
      case "my-songs":
        if (!songs.length && !props.tempSongs.length) return empty;
        break;
      default:
        if (!songs.length) return empty;
    }

    return songs.map((song, index) => {
      const active = song.id === currentSongData?.song.id;

      const isLastIndexInQueue = index === queueSongs.length - 1;

      switch (props.variant) {
        case "dashboard-songs":
          return (
            <SongItem
              active={active}
              onClick={() => props.handleSetSong(song)}
              variant={props.variant}
              song={song}
              index={index}
              key={song.queue_id}
            />
          );

        default:
          if (props.variant === "queue" && active && !isLastIndexInQueue) {
            return (
              <div key={song.queue_id}>
                <SongItem
                  active={active}
                  onClick={() => props.handleSetSong(song.queue_id)}
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
              onClick={() => props.handleSetSong(song.queue_id)}
              variant={props.variant}
              song={song}
              index={index}
              key={song.queue_id}
            />
          );
      }
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

import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  MinusCircleIcon,
  MusicalNoteIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, PopupWrapper } from ".";
import { useAuthStore, useSongContext, useTheme, useToast } from "../store";
import { useMemo } from "react";
import { SongItemModal } from "./SongItem";
import { useDispatch } from "react-redux";
import { addSongToQueue } from "@/store/songQueueSlice";
import { Link } from "react-router-dom";

type Base = {
  song: Song;
  handleOpenModal: (name: SongItemModal) => void;
  closeMenu: () => void;
};

type QueueMenu = Base & {
  variant: "queue";
  handleRemoveSongFromQueue: () => void;
};

type SysPlaylistMenu = Base & {
  variant: "sys-playlist";
};

type PlaylistMenu = Base & {
  variant: "playlist";
  handleRemoveSongFromPlaylist: () => void;
};

type DashboardPlaylistMenu = Base & {
  variant: "dashboard-playlist";
  handleRemoveSongFromPlaylist: () => void;
};

type HomeMenu = Base & {
  variant: "home";
  handleAddSongToPlaylist: (playlist: Playlist) => void;
};

type SearchBarMenu = Base & {
  variant: "search-bar";
  handleAddSongToPlaylist: (playlist: Playlist) => void;
};

type MySongMenu = Base & {
  variant: "my-songs";
  handleAddSongToPlaylist: (playlist: Playlist) => void;
};

type DashboardSongMenu = Base & {
  variant: "dashboard-songs";
  handleAddSongToPlaylist: (playlist: Playlist) => void;
};

type Props =
  | HomeMenu
  | SysPlaylistMenu
  | PlaylistMenu
  | MySongMenu
  | QueueMenu
  | DashboardSongMenu
  | DashboardPlaylistMenu
  | SearchBarMenu;

function SongMenu({ song, closeMenu, ...props }: Props) {
  // store
  const dispatch = useDispatch();
  const { user } = useAuthStore();
  const { theme, isOnMobile } = useTheme();
  const { setSuccessToast } = useToast();
  const { playlists } = useSongContext();

  const handleAddToQueue = () => {
    dispatch(addSongToQueue({ songs: [song] }));
    closeMenu();

    setSuccessToast(`Song added to queue`);
  };

  // define style
  const classes = {
    before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
    level2Menu:
      "w-[100%] absolute right-[calc(100%+5px)] hidden group-hover/add-playlist:block hover:block",
    menuItem: `hover:bg-${theme.alpha} font-[500] ${theme.content_hover_text} max-[549px]:!bg-transparent py-1 pl-2 rounded-md`,
    menuIcon: "w-5 mr-3",
    overlay:
      "absolute flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
  };

  const renderAddToPlaylistBtn = useMemo(() => {
    if (!user) return <></>;

    switch (props.variant) {
      case "search-bar":
      case "home":
      case "my-songs":
      case "dashboard-songs":
        if (isOnMobile)
          return (
            <Button
              className={`group relative ${classes.menuItem}  ${theme.content_hover_text} ${classes.before}`}
              variant={"list"}
              onClick={() => props.handleOpenModal("add-to-playlist")}
            >
              <PlusIcon className={classes.menuIcon} />
              Add to playlist
            </Button>
          );

        return (
          <Button
            className={`group/add-playlist hover:!brightness-100 relative ${classes.menuItem}  ${theme.content_hover_text} ${classes.before}`}
            variant={"list"}
            size={"clear"}
          >
            <PlusIcon className={classes.menuIcon} />
            Add to playlist
            {/* level 2 */}
            <PopupWrapper
              className={`${classes.level2Menu} z-[99]                  `}
              color="sidebar"
              theme={theme}
            >
              {/* playlist */}
              <ul className="w-full">
                {!!playlists?.length ? (
                  <>
                    {playlists.map((playlist, index) => {
                      return (
                        <li
                          key={index}
                          onClick={() => props.handleAddSongToPlaylist(playlist)}
                          className={`list-none w-full flex rounded-[4px] p-[5px] ${classes.menuItem}`}
                        >
                          <span>
                            <MusicalNoteIcon className={classes.menuIcon} />
                          </span>
                          <p className="line-clamp-1 text-left">{playlist.name}</p>
                        </li>
                      );
                    })}
                  </>
                ) : (
                  <p>No playlist jet...</p>
                )}
              </ul>
            </PopupWrapper>
          </Button>
        );
    }
  }, [playlists]);

  const renderMenuItem = () => {
    switch (props.variant) {
      case "search-bar":
      case "home":
        return (
          <>
            <Button
              onClick={handleAddToQueue}
              className={` ${classes.menuItem}`}
              variant={"list"}
              size={"clear"}
            >
              <PlusIcon className={classes.menuIcon} />
              Add to queue
            </Button>
            {renderAddToPlaylistBtn}
          </>
        );

      case "playlist":
      case "dashboard-playlist":
        return (
          <>
            <Button
              className={classes.menuItem}
              variant={"list"}
              size={"clear"}
              onClick={props.handleRemoveSongFromPlaylist}
            >
              <MinusCircleIcon className={classes.menuIcon} />
              Remove
            </Button>
          </>
        );
      case "my-songs":
      case "dashboard-songs":
        return (
          <>
            {props.variant !== "dashboard-songs" && (
              <Button
                onClick={handleAddToQueue}
                className={` ${classes.menuItem}`}
                variant={"list"}
                size={"clear"}
              >
                <PlusIcon className={classes.menuIcon} />
                Add to queue
              </Button>
            )}
            {renderAddToPlaylistBtn}
            <Button
              onClick={() => props.handleOpenModal("edit")}
              className={` ${classes.menuItem} `}
              variant={"list"}
              size={"clear"}
            >
              <AdjustmentsHorizontalIcon className={classes.menuIcon} />
              Edit
            </Button>
            <Link to={`edit/${song.id}`}>
              <Button className={` ${classes.menuItem} `} variant={"list"}>
                <DocumentTextIcon className={classes.menuIcon} />
                {song.lyric_id ? "Edit lyric" : "Add lyric"}
              </Button>
            </Link>
            <Button
              onClick={() => props.handleOpenModal("delete")}
              className={` ${classes.menuItem} `}
              variant={"list"}
              size={"clear"}
            >
              <TrashIcon className={classes.menuIcon} />
              Delete
            </Button>
          </>
        );
      case "queue":
        return (
          <>
            <Button
              onClick={props.handleRemoveSongFromQueue}
              className={` ${classes.menuItem}`}
              variant={"list"}
              size={"clear"}
            >
              <MinusCircleIcon className={classes.menuIcon} />
              Remove
            </Button>
            {renderAddToPlaylistBtn}
          </>
        );
    }
  };

  const renderSongInfo = useMemo(() => {
    switch (props.variant) {
      case "queue":
        return <></>;
      default:
        return (
          <div className={`pl-[10px] py-[6px] bg-${theme.alpha} rounded-md mb-3`}>
            <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
            <p className="text-sm opacity-70 line-clamp-1">{song.singer}</p>
          </div>
        );
    }
  }, [song]);

  return (
    <>
      <div className={` ${props.variant === "queue" ? "w-[140px]" : "w-[200px]"} `}>
        {renderSongInfo}
        {renderMenuItem()}

        <a
          target="_blank"
          download
          href={song.song_url}
          className={` ${classes.menuItem} w-full inline-flex items-center cursor-pointer`}
        >
          <ArrowDownTrayIcon className={classes.menuIcon} />
          Download
        </a>
        {/* </div> */}

        {props.variant !== "queue" && !isOnMobile && (
          <p className="opacity-50 font-[500] text-center text-[13px] mt-[10px]">
            Uploaded by {song.by}
          </p>
        )}
      </div>
    </>
  );
}

export default SongMenu;

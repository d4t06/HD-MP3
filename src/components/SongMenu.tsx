import {
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  DocumentTextIcon,
  MinusCircleIcon,
  MusicalNoteIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { PopupWrapper } from ".";
import { useAuthStore, useSongContext, useTheme, useToast } from "../store";
import { useMemo } from "react";
import { SongItemModal } from "./SongItem";
import { useDispatch } from "react-redux";
import { addSongToQueue } from "@/store/songQueueSlice";
import { Link } from "react-router-dom";
import { MenuList } from "./ui/MenuWrapper";

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
    ctaContainer:
      "[&>*]:p-2 [&>*]:w-full [&>*]:text-sm [&>*]:flex [&>*]:items-center [&>*]:rounded-md hover:[&>*:not(div.absolute)]:bg-white/5",
    menuItem: ``,
    menuIcon: "w-5 mr-2",
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
            <button
              className={`group relative ${classes.menuItem} ${classes.before}`}
              onClick={() => props.handleOpenModal("add-to-playlist")}
            >
              <PlusIcon className={classes.menuIcon} />
              Add to playlist
            </button>
          );

        return (
          <button
            className={`group/add-playlist relative ${classes.menuItem}  ${classes.before}`}
          >
            <PlusIcon className={classes.menuIcon} />
            Add to playlist
            {/* level 2 */}
            <PopupWrapper
              className={`${classes.level2Menu} z-[99]                  `}
              theme={theme}
            >
              {/* playlist */}
              <ul className={classes.ctaContainer}>
                {playlists?.length ? (
                  <>
                    {playlists.map((playlist, index) => {
                      return (
                        <li
                          key={index}
                          onClick={() => props.handleAddSongToPlaylist(playlist)}
                        >
                          <MusicalNoteIcon className={classes.menuIcon} />
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
          </button>
        );
    }
  }, [playlists]);

  const renderMenuItem = () => {
    switch (props.variant) {
      case "search-bar":
      case "home":
        return (
          <>
            <button onClick={handleAddToQueue} className={`${classes.menuItem}`}>
              <PlusIcon className={classes.menuIcon} />
              Add to queue
            </button>
            {renderAddToPlaylistBtn}
          </>
        );

      case "playlist":
      case "dashboard-playlist":
        return (
          <>
            <button
              className={classes.menuItem}
              onClick={props.handleRemoveSongFromPlaylist}
            >
              <MinusCircleIcon className={classes.menuIcon} />
              Remove
            </button>
          </>
        );
      case "my-songs":
      case "dashboard-songs":
        return (
          <>
            {props.variant !== "dashboard-songs" && (
              <button onClick={handleAddToQueue} className={` ${classes.menuItem}`}>
                <PlusIcon className={classes.menuIcon} />
                Add to queue
              </button>
            )}
            {renderAddToPlaylistBtn}
            <button
              onClick={() => props.handleOpenModal("edit")}
              className={` ${classes.menuItem} `}
            >
              <AdjustmentsHorizontalIcon className={classes.menuIcon} />
              Edit
            </button>
            <Link to={`edit/${song.id}`}>
              <DocumentTextIcon className={classes.menuIcon} />
              {song.lyric_id ? "Edit lyric" : "Add lyric"}
            </Link>
            <button
              onClick={() => props.handleOpenModal("delete")}
              className={` ${classes.menuItem} `}
            >
              <TrashIcon className={classes.menuIcon} />
              Delete
            </button>
          </>
        );
      case "queue":
        return (
          <>
            <button
              onClick={props.handleRemoveSongFromQueue}
              className={` ${classes.menuItem}`}
            >
              <MinusCircleIcon className={classes.menuIcon} />
              Remove
            </button>
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
          <div className="px-2">
            <div className={`pl-[10px] py-[6px] bg-[#fff]/5 rounded-md mb-3`}>
              <h5 className="line-clamp-1 font-[500]">{song.name}</h5>
              <p className="text-sm opacity-70 line-clamp-1">{song.singer}</p>
            </div>
          </div>
        );
    }
  }, [song]);

  return (
    <>
      <div className={` ${props.variant === "queue" ? "w-[140px]" : "w-[200px]"} `}>
        {renderSongInfo}

        <MenuList>
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
        </MenuList>

        {props.variant !== "queue" && !isOnMobile && (
          <p className="opacity-50 font-[500] text-center text-xs mt-[10px]">
            Uploaded by {song.by}
          </p>
        )}
      </div>
    </>
  );
}

export default SongMenu;

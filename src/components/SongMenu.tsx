import {
   ArrowDownTrayIcon,
   MinusCircleIcon,
   MusicalNoteIcon,
   PencilIcon,
   PlusCircleIcon,
   PlusIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, PopupWrapper } from ".";
import { useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import { useMemo } from "react";
import { SongItemModal } from "./SongItem";
import { useDispatch } from "react-redux";
import { addSongToQueue } from "@/store/songQueueSlice";

type Base = {
   song: Song;
   handleOpenModal: (name: SongItemModal) => void;
};

type QueueMenu = Base & {
   variant: "queue";
   handleRemoveSongFromQueue: () => void;
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

type MySongMenu = Base & {
   variant: "my-songs";
   handleAddSongToPlaylist: (playlist: Playlist) => void;
};

type DashboardSongMenu = Base & {
   variant: "dashboard-songs";
   handleAddSongToPlaylist: (playlist: Playlist) => void;
};

// type Props = {
//    songData: Song;
//    isOnMobile: boolean;
//    inQueue?: boolean;
//    admin?: boolean;
//    inPlaylist?: Playlist;
//    handleOpenModal: (name: SongItemModal) => void;
//    handleAddSongToPlaylist: (playlist: Playlist) => void;
//    handleRemoveSongFromPlaylist: () => void;
// };

type Props =
   | HomeMenu
   | PlaylistMenu
   | MySongMenu
   | QueueMenu
   | DashboardSongMenu
   | DashboardPlaylistMenu;

function SongMenu({ song, ...props }: Props) {
   // store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { setSuccessToast } = useToast();
   const { userPlaylists } = useSongsStore();

   const isOnMobile = useMemo(() => {
      return window.innerWidth < 800;
   }, []);

   const handleAddToQueue = () => {
      dispatch(addSongToQueue({ songs: [song] }));
      setSuccessToast({ message: `'${song.name}' to queue` });
   };

   // define style
   const classes = {
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
      level2Menu:
         "w-[100%] absolute right-[calc(100%+5px)] hidden group-hover/add-playlist:block hover:block",
      menuItem: `hover:bg-${theme.alpha} ${theme.content_hover_text} max-[549px]:!bg-transparent pl-[8px] rounded-[4px]`,
      menuIcon: "w-[18px] mr-[8px]",
      overlay:
         "absolute flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
   };

   const renderAddToPlaylistBtn = useMemo(() => {
      switch (props.variant) {
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
                     <PlusCircleIcon className={classes.menuIcon} />
                     Add to playlist
                  </Button>
               );

            return (
               <Button
                  className={`group/add-playlist hover:!brightness-100 relative ${classes.menuItem}  ${theme.content_hover_text} ${classes.before}`}
                  variant={"list"}
               >
                  <PlusCircleIcon className={classes.menuIcon} />
                  Add to playlist
                  {/* level 2 */}
                  <PopupWrapper
                     variant={"thin"}
                     className={`${classes.level2Menu} z-[99] 
                  
                     `}
                     color="sidebar"
                     theme={theme}
                  >
                     {/* playlist */}
                     <ul className="w-full">
                        {!!userPlaylists?.length && (
                           <>
                              {userPlaylists.map((playlist, index) => {
                                 const isAdded = playlist.song_ids.includes(song.id);

                                 return (
                                    <li
                                       key={index}
                                       onClick={() =>
                                          !isAdded &&
                                          props.handleAddSongToPlaylist(playlist)
                                       }
                                       className={`list-none w-full flex rounded-[4px] p-[5px] ${
                                          isAdded && "opacity-60 pointer-events-none"
                                       } ${classes.menuItem}`}
                                    >
                                       <span>
                                          <MusicalNoteIcon className={classes.menuIcon} />
                                       </span>
                                       <p className="line-clamp-1 text-left">
                                          {playlist.name} {isAdded && "(Added)"}
                                       </p>
                                    </li>
                                 );
                              })}
                           </>
                        )}
                     </ul>
                  </PopupWrapper>
               </Button>
            );
      }
   }, [userPlaylists]);

   const renderMenuItem = useMemo(() => {
      switch (props.variant) {
         case "home":
            return (
               <>
                  <Button
                     onClick={handleAddToQueue}
                     className={` ${classes.menuItem}`}
                     variant={"list"}
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
                  >
                     <PencilIcon className={classes.menuIcon} />
                     Edit
                  </Button>
                  <Button
                     onClick={() => props.handleOpenModal("delete")}
                     className={` ${classes.menuItem} `}
                     variant={"list"}
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
                  >
                     <MinusCircleIcon className={classes.menuIcon} />
                     Remove
                  </Button>
                  {renderAddToPlaylistBtn}
               </>
            );
      }
   }, [props]);

   if (!user) return <></>;

   return (
      <>
         <div className={` ${props.variant === "queue" ? "w-[160px]" : "w-[200px]"} `}>
            <h5 className="text-[14px] line-clamp-1">{song.name}</h5>
            <p className="text-[12px] text-gray-500 line-clamp-1">{song.singer}</p>

            <div className={`mt-[14px]`}>
               {renderMenuItem}

               <a
                  target="_blank"
                  download
                  href={song.song_url}
                  className={` ${classes.menuItem} w-full py-[5px] text-[14px] inline-flex items-center cursor-pointer`}
               >
                  <ArrowDownTrayIcon className="w-[18px] mr-[5px]" />
                  Download
               </a>
            </div>

            {props.variant !== "queue" && !isOnMobile && (
               <p className="opacity-60 text-center text-[12px] mt-[10px]">
                  uploaded by {song.by}
               </p>
            )}
         </div>
      </>
   );
}

export default SongMenu;

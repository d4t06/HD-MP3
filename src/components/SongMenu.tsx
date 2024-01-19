import {
   ArrowDownTrayIcon,
   BackspaceIcon,
   DocumentPlusIcon,
   MinusCircleIcon,
   MusicalNoteIcon,
   PencilSquareIcon,
   PlusCircleIcon,
   TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, PopupWrapper } from ".";
import { Playlist, Song } from "../types";
import { useActuallySongs, useAuthStore, useSongsStore, useTheme, useToast } from "../store";
import { Link } from "react-router-dom";
import { memo, useMemo } from "react";

type Props = {
   songData: Song;
   isOnMobile: boolean;
   inQueue?: boolean;
   admin?: boolean;
   inPlaylist?: Playlist;
   handleOpenModal: (name: string) => void;
   handleAddSongToPlaylist: (playlist: Playlist) => void;
   handleRemoveSongFromPlaylist: () => void;
};

function SongMenu({
   isOnMobile,
   admin,
   inPlaylist,
   inQueue,
   songData,
   handleOpenModal,
   handleAddSongToPlaylist,
   handleRemoveSongFromPlaylist,
}: Props) {
   const { theme } = useTheme();
   const { userInfo } = useAuthStore();
   const { setSuccessToast } = useToast();
   const { actuallySongs, removeFromQueue, addToQueue } = useActuallySongs();
   const { userPlaylists } = useSongsStore();

   const userInAdminPlaylist = useMemo(() => !admin && inPlaylist?.by === "admin", [admin, inPlaylist]);

   const handleAddToQueue = () => {
      addToQueue(songData);
      setSuccessToast({ message: "Song add to queue" });
   };

   const handleRemoveSongFromQueue = () => {
      if (!inQueue) return;
      removeFromQueue(songData);
      setSuccessToast({ message: "Song removed from queue" });
   };

   // define style
   const classes = {
      before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
      level2Menu: "w-[100%] absolute right-[calc(100%+5px)] hidden group-hover/add-playlist:block hover:block",
      menuItem: `hover:bg-${theme.alpha} ${theme.content_hover_text} pl-[12px] rounded-[4px]`,
      menuIcon: "w-[18px] mr-[8px]",
      overlay: "absolute flex items-center justify-center inset-0 bg-[#000] bg-opacity-[.5]",
   };

   const renderAddToPlaylistBtn = (
      <>
         {isOnMobile ? (
            <Button
               className={`group relative ${classes.menuItem}  ${theme.content_hover_text} ${classes.before}`}
               variant={"list"}
               onClick={() => handleOpenModal("addToPlaylist")}
            >
               <PlusCircleIcon className={classes.menuIcon} />
               Add to playlist
            </Button>
         ) : (
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
                              const isAdded = playlist.song_ids.includes(songData.id);

                              return (
                                 <li
                                    key={index}
                                    onClick={() => !isAdded && handleAddSongToPlaylist(playlist)}
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
         )}
      </>
   );

   return (
      <>
         <div className={` ${inQueue ? "w-[160px]" : "w-[200px]"} `}>
            <div className="ml-[14px] mt-[10px]">
               <h5 className="text-[14px] line-clamp-1">{songData.name}</h5>
               <p className="text-[12px] text-gray-500 line-clamp-1">{songData.singer}</p>
            </div>

            <div className={`mt-[14px]`}>
               {actuallySongs && (
                  <Button
                     onClick={inQueue ? handleRemoveSongFromQueue : handleAddToQueue}
                     className={` ${classes.menuItem}`}
                     variant={"list"}
                  >
                     <BackspaceIcon className={classes.menuIcon} />
                     {inQueue ? "Remove" : "Add to queue"}
                  </Button>
               )}

               {/* alway visible in dashboard */}
               {userInfo?.email && (
                  <>
                     {(admin && !inPlaylist) || !inPlaylist || userInAdminPlaylist ? (
                        renderAddToPlaylistBtn
                     ) : (
                        <Button className={classes.menuItem} variant={"list"} onClick={handleRemoveSongFromPlaylist}>
                           <MinusCircleIcon className={classes.menuIcon} />
                           Remove
                        </Button>
                     )}
                  </>
               )}

               {/* alway visible in dashboard    */}
               {(admin || songData.by !== "admin") && !inQueue && (
                  <>
                     {!inPlaylist && (
                        <Button
                           onClick={() => handleOpenModal("edit")}
                           className={` ${classes.menuItem} `}
                           variant={"list"}
                        >
                           <PencilSquareIcon className={classes.menuIcon} />
                           Edit
                        </Button>
                     )}

                     <Link to={`edit/${songData.id}`}>
                        <Button className={` ${classes.menuItem} `} variant={"list"}>
                           <DocumentPlusIcon className={classes.menuIcon} />
                           {songData.lyric_id ? "Add lyric" : "Edit lyric"}
                        </Button>
                     </Link>

                     <Button
                        onClick={() => handleOpenModal("confirm")}
                        className={` ${classes.menuItem} `}
                        variant={"list"}
                     >
                        <TrashIcon className={classes.menuIcon} />
                        Delete
                     </Button>
                  </>
               )}

               <a
                  target="_blank"
                  download
                  href={songData.song_url}
                  className={` ${classes.menuItem} w-full py-[5px] text-[14px] inline-flex items-center cursor-pointer`}
               >
                  <ArrowDownTrayIcon className="w-[18px] mr-[5px]" />
                  Download
               </a>
            </div>

            {!inQueue && !isOnMobile && (
               <p className="opacity-60 text-center text-[12px] mt-[10px]">uploaded by {songData.by}</p>
            )}
         </div>
      </>
   );
}

export default memo(SongMenu);

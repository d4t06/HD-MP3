import { useSelector } from "react-redux";
import { AddPlaylist, Empty, Modal, PlaylistItem } from ".";
import { selectAllSongStore, useTheme } from "../store";
import { PlaylistSkeleton } from "./skeleton";
import { useState } from "react";

type Base = {
   className?: string;
   playlist: Playlist[];
   loading: boolean;
   activeCondition?: boolean;
};

type CallbackProps = {
   isFetching: boolean;
   addPlaylist: (name: string) => Promise<void>;
};

type InHome = Base & {
   location: "home";
};

type InMySongs = Base &
   CallbackProps & {
      location: "my-songs";
   };

type InDashboard = Base &
   CallbackProps & {
      location: "dashboard";
   };

type Props = InHome | InMySongs | InDashboard;

export default function PlaylistList({
   playlist,
   loading,
   activeCondition = true,
   className,
   ...props
}: Props) {
   const { theme } = useTheme();
   const { song: songInStore } = useSelector(selectAllSongStore);

   const [isOpenModal, setIsOpenModal] = useState(false);

   const closeModal = () => setIsOpenModal(false);

   const classes = {
      playlistItem: "w-1/4 p-[8px] max-[800px]:w-1/2",
   };

   return (
      <>
         <div className={`flex flex-row flex-wrap -mx-[8px] ${className}`}>
            {loading && PlaylistSkeleton}
            {!loading && (
               <>
                  {!!playlist.length
                     ? playlist.map((playlist, index) => {
                          const active =
                             activeCondition && songInStore.song_in.includes(playlist.id);

                          switch (props.location) {
                             case "home":
                             case "my-songs":
                                return (
                                   <div key={index} className={classes.playlistItem}>
                                      <PlaylistItem
                                         active={active}
                                         theme={theme}
                                         data={playlist}
                                      />
                                   </div>
                                );

                             case "dashboard":
                                return (
                                   <div key={index} className={classes.playlistItem}>
                                      <PlaylistItem
                                         active={active}
                                         theme={theme}
                                         data={playlist}
                                         link={`/dashboard/playlist/${playlist.id}`}
                                      />
                                   </div>
                                );
                          }
                       })
                     : props.location === "home" && (
                          <p className="text-center w-full">...</p>
                       )}
                  {props.location !== "home" && (
                     <div className={`${classes.playlistItem} mb-[25px]`}>
                        <Empty
                           theme={theme}
                           className="pt-[100%]"
                           onClick={() => setIsOpenModal(true)}
                        />
                     </div>
                  )}
               </>
            )}
         </div>

         {props.location !== "home" && isOpenModal && (
            <Modal closeModal={closeModal}>
               <AddPlaylist
                  addPlaylist={props.addPlaylist}
                  isFetching={props.isFetching}
                  close={closeModal}
               />
            </Modal>
         )}
      </>
   );
}

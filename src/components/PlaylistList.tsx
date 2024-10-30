import { useSelector } from "react-redux";
import { AddPlaylist, Empty, Modal, PlaylistItem } from ".";
import { useTheme } from "../store";
import { PlaylistSkeleton } from "./skeleton";
import { useRef } from "react";
import { selectCurrentSong } from "@/store/currentSongSlice";
import usePlaylistActions from "@/hooks/usePlaylistActions";
import useAdminPlaylistActions from "@/hooks/useAdminPlaylistActions";
import { ModalRef } from "./Modal";

type Base = {
  className?: string;
  playlist: Playlist[];
  loading: boolean;
  activeCondition?: boolean;
};

type InHome = Base & {
  location: "home";
};

type InMySongs = Base & {
  location: "my-songs";
};

type InDashboard = Base & {
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
  // store
  const { theme } = useTheme();
  const { currentSong } = useSelector(selectCurrentSong);

  // ref
  const modalRef = useRef<ModalRef>(null);

  // hook
  const { addPlaylist, isFetching } = usePlaylistActions();
  const { addAdminPlaylist, isFetching: adminIsFetching } = useAdminPlaylistActions();

  const closeModal = () => modalRef.current?.toggle();

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
                    activeCondition && currentSong?.song_in.includes(playlist.id);

                  switch (props.location) {
                    case "home":
                    case "my-songs":
                      return (
                        <div key={index} className={classes.playlistItem}>
                          <PlaylistItem active={active} data={playlist} />
                        </div>
                      );

                    case "dashboard":
                      return (
                        <div key={index} className={classes.playlistItem}>
                          <PlaylistItem
                            active={active}
                            data={playlist}
                            link={`/dashboard/playlist/${playlist.id}`}
                          />
                        </div>
                      );
                  }
                })
              : props.location === "home" && <p className="text-center w-full">...</p>}
            {props.location !== "home" && (
              <div className={`${classes.playlistItem} mb-[25px]`}>
                <Empty theme={theme} onClick={() => modalRef.current?.toggle()} />
              </div>
            )}
          </>
        )}
      </div>

      {props.location !== "home" && (
        <Modal variant="animation" ref={modalRef}>
          {props.location === "my-songs" && (
            <AddPlaylist
              addPlaylist={addPlaylist}
              isFetching={isFetching}
              close={closeModal}
            />
          )}

          {props.location === "dashboard" && (
            <AddPlaylist
              addPlaylist={addAdminPlaylist}
              isFetching={adminIsFetching}
              close={closeModal}
            />
          )}
        </Modal>
      )}
    </>
  );
}

import { usePopoverContext } from "@/components/MyPopup";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "@/pages/dashboard/playlist/edit-playlist/_hooks/usePlaylistAction";
import { DashboardSongMenuWrapper } from "..";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";

type Props = {
  song: Song;
};

export default function PlaylistMenu({ song }: Props) {
  const { action, isFetching, playlist } = useDashboardPlaylistActions();
  const { close } = usePopoverContext();

  const classes = {
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
  };

  const handlePlaylistAction = async (props: PlaylistActionProps) => {
    switch (props.variant) {
      case "remove-song":
        await action({
          variant: "remove-song",
          song: props.song,
        });

        break;
      case "update-image":
        await action({
          variant: "update-image",
          song: props.song,
        });

        break;
    }

    close();
  };

  return (
    <>
      <DashboardSongMenuWrapper song={song}>
        <button
          onClick={() =>
            handlePlaylistAction({
              variant: "remove-song",
              song,
            })
          }
        >
          <TrashIcon className="w-5" />
          <span>Remove</span>
        </button>

        <button
          onClick={() =>
            handlePlaylistAction({
              variant: "add-singer",
              singer: song.singers[0],
            })
          }
        >
          <PlusIcon className="w-5" />
          <span>Add singer to playlist</span>
        </button>

        {song.image_url && (
          <button
            className={`${playlist?.image_url === song.image_url ? "disable" : ""}`}
            onClick={() =>
              handlePlaylistAction({
                variant: "update-image",
                song,
              })
            }
          >
            <PhotoIcon className={`w-5`} />
            <span>Set playlist image</span>
          </button>
        )}

        {isFetching && (
          <div className={classes.overlay}>
            <div
              className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
            ></div>
          </div>
        )}
      </DashboardSongMenuWrapper>
    </>
  );
}

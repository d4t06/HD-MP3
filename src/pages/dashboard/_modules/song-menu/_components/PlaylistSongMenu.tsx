import { usePopoverContext } from "@/components/MyPopup";
import useDashboardPlaylistActions, {
  PlaylistActionProps,
} from "@/pages/dashboard/playlist/edit-playlist/_hooks/usePlaylistAction";
import { DashboardSongMenuWrapper } from "..";
import { PhotoIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { ModalRef, Title } from "@/components";
import { DashboardModal } from "@/pages/dashboard/_components";
import { ContentWrapper } from "@/pages/dashboard/_components/ui/ModalWrapper";

type Props = {
  song: Song;
};

export default function PlaylistMenu({ song }: Props) {
  const { action, isFetching, playlist } = useDashboardPlaylistActions();
  const { close } = usePopoverContext();

  const modalRef = useRef<ModalRef>(null);

  const classes = {
    overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
  };

  const openModal = () => {
    modalRef.current?.open();

    close();
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

      case "add-singer": {
        await action({ variant: "add-singer", singer: props.singer });

        modalRef.current?.close();
      }
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

        <button onClick={openModal}>
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

      <DashboardModal ref={modalRef}>
        <ContentWrapper>
          <Title title="Singers" />
          <div className="space-x-2 mt-3 [&>*]:px-3 [&>*]:py-1 [&>*]:rounded-md  [&>*]:bg-[#f1f1f1] hover:[&>*]:bg-black/10">
            {song.singers.map((s, i) => (
              <button
                key={i}
                onClick={() =>
                  handlePlaylistAction({
                    variant: "add-singer",
                    singer: s,
                  })
                }
              >
                {s.name}
              </button>
            ))}
          </div>
        </ContentWrapper>
      </DashboardModal>
    </>
  );
}

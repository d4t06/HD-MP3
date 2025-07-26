import { Input, Modal, ModalContentWrapper, ModalRef } from "@/components";
import { PlaylistModalVariantProps } from "@/modules/add-playlist-form";
import useAddPlaylistForm from "@/modules/add-playlist-form/_hooks/useAddPlaylistForm";
import { Button } from "@/pages/dashboard/_components";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function PlaylistLike(props: PlaylistModalVariantProps) {
  const { playlist } = usePlaylistContext();
  const { updatePlaylistData, playlistData, isValidToSubmit } =
    useAddPlaylistForm(props);

  const { action, isFetching } = useDashboardPlaylistActions();

  const modalRef = useRef<ModalRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleAddPlaylist = async () => {
    if (!playlistData || !isValidToSubmit) return;

    //  it must be change something here!!
    await action({
      variant: "edit-playlist",
      playlist: playlistData,
    });

    modalRef.current?.close();
  };

  if (!playlist) return;

  return (
    <>
      <div className="flex items-center space-x-2">
        <p>
          <span>Likes: </span> {abbreviateNumber(playlist.like)}
        </p>

        <button onClick={() => modalRef.current?.open()}>
          <PencilIcon className="w-5" />
        </button>
      </div>

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper>
          <div>
            <label htmlFor="like">Like</label>
            <Input
              id="like"
              ref={inputRef}
              type="number"
              value={playlistData?.like + ""}
              onChange={(e) => updatePlaylistData({ like: +e.target.value })}
            />
          </div>

          <p className="text-right mt-5">
            <Button
              loading={isFetching}
              color="primary"
              onClick={handleAddPlaylist}
              disabled={!isValidToSubmit}
              className={`font-playwriteCU rounded-full`}
            >
              Save
            </Button>
          </p>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}

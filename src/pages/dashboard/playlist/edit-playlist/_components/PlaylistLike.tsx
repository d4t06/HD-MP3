import { Input, Modal, ModalContentWrapper, ModalRef } from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { usePlaylistContext } from "@/stores/dashboard/PlaylistContext";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import useDashboardPlaylistActions from "../_hooks/usePlaylistAction";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function PlaylistLike() {
  const { playlist } = usePlaylistContext();

  const { action, isFetching } = useDashboardPlaylistActions();

  const [value, setValue] = useState("");

  const modalRef = useRef<ModalRef>(null);

  const handleAddPlaylist = async () => {
    if (!value || isNaN(+value)) return;

    await action({
      variant: "edit-playlist",
      playlist: { like: +value },
    });

    modalRef.current?.close();
  };

  useEffect(() => {
    if (playlist) {
      setValue(playlist.like + "");
    }
  }, [playlist?.like]);

  if (!playlist) return <></>;

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
              value={+value ? +value : ""}
              id="like"
              onChange={(e) => setValue(e.target.value)}
              type="number"
            />
          </div>

          <p className="text-right mt-5">
            <Button
              loading={isFetching}
              color="primary"
              onClick={handleAddPlaylist}
              // disabled={}
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

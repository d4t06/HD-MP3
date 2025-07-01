import {
  Input,
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
} from "@/components";
import { Button } from "@/pages/dashboard/_components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ClipboardDocumentIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function EditSongBtn() {
  const modalRef = useRef<ModalRef>(null);

  const { songData, updateSongData, song } = useAddSongContext();

  const [localSongData, setLocalSongData] = useState<Partial<Song>>({
    name: "",
    like: 0,
  });

  const updateLocalSongData = (data: Partial<Song>) => {
    setLocalSongData((prev) => ({ ...prev, ...data }));
  };

  const _updateSongData = () => {
    updateSongData(localSongData);
    modalRef.current?.close();
  };

  useEffect(() => {
    if (songData) {
      setLocalSongData({ name: songData.name, like: songData.like });
    }
  }, [songData]);

  return (
    <>
      <Button onClick={() => modalRef.current?.open()} size={"clear"}>
        <PencilIcon />
        <span>Edit</span>
      </Button>

      <Link to={`/dashboard/lyric/${song?.id}`}>
        <Button size={"clear"}>
          <ClipboardDocumentIcon />
          <span>Lyric</span>
        </Button>
      </Link>

      <Modal variant="animation" ref={modalRef}>
        <ModalContentWrapper>
          <ModalHeader
            title="Edit song"
            close={() => modalRef.current?.close()}
          />

          <div className="space-y-2.5">
            <div>
              <p>Name:</p>
              <Input
                className="bg-black/10"
                value={localSongData?.name}
                onChange={(e) => updateLocalSongData({ name: e.target.value })}
              />
            </div>

            <div className="t">
              <p>Like:</p>
              <Input
                className="bg-black/10"
                value={localSongData?.like}
                onChange={(e) =>
                  !isNaN(+e.target.value)
                    ? updateLocalSongData({ like: +e.target.value })
                    : {}
                }
              />
            </div>
          </div>

          <p className="mt-6 text-right">
            <Button onClick={_updateSongData}>Ok</Button>
          </p>
        </ModalContentWrapper>
      </Modal>
    </>
  );
}

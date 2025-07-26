import { useMemo, useRef, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  Input,
  Label,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
} from "@/components";
import {
  Button,
  DashboardModal,
  ItemRightCtaFrame,
} from "@/pages/dashboard/_components";
import { useAddAlbumContext } from "./AddAlbumContext";
import SingerSearchModal from "@/modules/add-song-form/_components/SingerSearchModal";

type Props = {
  closeModal: () => void;
};

export default function EditAlbumModal({ closeModal }: Props) {
  const { albumData, singer, setSinger, updateAlbumData } =
    useAddAlbumContext();

  if (!albumData || !singer)
    throw new Error("albumData or singer is undefined");

  const [localAlbumData, setLocalAlbumData] =
    useState<PlaylistSchema>(albumData);
  const [localSinger, setLocalSinger] = useState<Singer>(singer);

  const modalRef = useRef<ModalRef>(null);

  const isChanged = useMemo(() => {
    return (
      localAlbumData.name !== albumData.name ||
      localAlbumData.like !== albumData.like ||
      localSinger !== singer
    );
  }, [localAlbumData, localSinger]);

  const isValidToSubmit = useMemo(() => {
    const isValidPlaylistData = !!localAlbumData?.name && !!localSinger;

    return isValidPlaylistData && isChanged;
  }, [isChanged]);

  const updateLocalAlbumData = (data?: Partial<PlaylistSchema>) => {
    setLocalAlbumData({ ...localAlbumData, ...data });
  };

  const handleChooseSinger = (s: Singer) => {
    setLocalSinger(s);
    modalRef.current?.close();
  };

  const handleSubmit = () => {
    setSinger(localSinger);
    updateAlbumData(localAlbumData);

    closeModal();
  };

  if (!localAlbumData) return;

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader closeModal={closeModal} title={"Edit album"} />

        <div className="flex-grow overflow-auto space-y-3">
          <div className="space-y-1">
            <Label htmlFor="name">Album name:</Label>
            <Input
              type="text"
              id="name"
              placeholder=""
              className="bg-[#f1f1f1]"
              value={localAlbumData.name}
              onChange={(e) => updateLocalAlbumData({ name: e.target.value })}
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Singer:</Label>

            <div className="-mt-2 -ml-2">
              <ItemRightCtaFrame className="mt-0 w-fit">
                <span>{localSinger.name}</span>

                <div>
                  <button onClick={() => modalRef.current?.open()}>
                    <ArrowPathIcon className="w-5" />
                  </button>
                </div>
              </ItemRightCtaFrame>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="like">Like:</Label>

            <Input
              id="like"
              className={`bg-[#f1f1f1]`}
              type="number"
              value={localAlbumData.like + ""}
              onChange={(e) => updateLocalAlbumData({ like: +e.target.value })}
            />
          </div>
        </div>

        <p className="text-right mt-5">
          <Button onClick={handleSubmit} disabled={!isValidToSubmit}>
            Ok
          </Button>
        </p>
      </ModalContentWrapper>

      <DashboardModal ref={modalRef}>
        <SingerSearchModal
          choose={handleChooseSinger}
          closeModal={() => modalRef.current?.close()}
        />
      </DashboardModal>
    </>
  );
}

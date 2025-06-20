import { useMemo, useRef, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import {
  Input,
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
        <ModalHeader close={closeModal} title={"Edit album"} />

        <div className="flex-grow overflow-auto">
          <div className="flex-grow flex flex-col mt-3  space-y-2.5 md:mt-0 md:ml-3">
            <div className="space-y-1">
              <label htmlFor="name" className="opacity-[.8]">
                Album name:
              </label>
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
              <label htmlFor="description" className="opacity-[.8]">
                Singer:
              </label>

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
              <label htmlFor="like" className="opacity-[.8]">
                Like:
              </label>

              <Input
                id="like"
                className={`bg-[#f1f1f1]`}
                type="number"
                value={localAlbumData.like + ""}
                onChange={(e) =>
                  updateLocalAlbumData({ like: +e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <p className="text-right mt-3">
          <Button
            color="primary"
            onClick={handleSubmit}
            disabled={!isValidToSubmit}
            className={`font-playwriteCU rounded-full`}
          >
            Save
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

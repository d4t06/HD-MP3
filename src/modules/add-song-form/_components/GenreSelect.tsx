import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef, useState } from "react";
import { ModalRef } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { Button, Frame } from "@/pages/dashboard/_components";
import GenreSearchModal from "./GenreSearchModal";
import ItemRightCtaFrame from "@/pages/dashboard/_components/ui/ItemRightCtaFrame";
import { TrashIcon } from "@heroicons/react/24/outline";
import DashBoardModal from "@/pages/dashboard/_components/ui/Modal";
import MainGenreSelectModal from "./MainGenreSelectModal";

type Modal = "sub" | "main";

export default function GenreSelect() {
  const { genres, songData, updateSongData, selectGenre } = useAddSongContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  const handleChoose = (genre: Genre) => {
    selectGenre(genre);
    closeModal();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <div className="space-y-2">
        <div className="text-lg font-bold text-[#333]">Genre</div>

        <Frame className="mt-1">
          <div>Main genre</div>

          <div className="-ml-2">
            {songData?.main_genre && (
              <ItemRightCtaFrame className="w-fit">
                <span>{songData.main_genre.name}</span>

                <div>
                  <button
                    onClick={() => updateSongData({ main_genre: undefined })}
                  >
                    <TrashIcon className="w-5" />
                  </button>
                </div>
              </ItemRightCtaFrame>
            )}

            {!songData?.main_genre && (
              <Button
                onClick={() => openModal("main")}
                className="mt-2 ml-2 h-[38px] w-[38px] justify-center"
                size={"clear"}
              >
                <PlusIcon className="w-5" />
              </Button>
            )}
          </div>

          <div className="mt-6">Sub genres</div>

          <div className="flex flex-wrap -ml-2">
            {genres.map((g, i) => (
              <ItemRightCtaFrame key={i}>
                <span>{g.name}</span>

                <div>
                  <button onClick={() => selectGenre(g)}>
                    <TrashIcon className="w-5" />
                  </button>
                </div>
              </ItemRightCtaFrame>
            ))}

            <Button
              onClick={() => openModal("sub")}
              className="mt-2 ml-2 h-[38px] w-[38px] justify-center"
              size={"clear"}
            >
              <PlusIcon className="w-5" />
            </Button>
          </div>
        </Frame>
      </div>

      <DashBoardModal ref={modalRef}>
        {modal === "sub" && (
          <GenreSearchModal closeModal={closeModal} choose={handleChoose} />
        )}
        {modal === "main" && (
          <MainGenreSelectModal
            closeModal={closeModal}
            choose={(g) => updateSongData({ main_genre: g })}
          />
        )}
      </DashBoardModal>
    </>
  );
}

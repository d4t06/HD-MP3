import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { ModalRef } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { Button, Frame } from "@/pages/dashboard/_components";
import GenreSearchModal from "./GenreSearchModal";
import ItemRightCtaFrame from "@/pages/dashboard/_components/ui/ItemRightCtaFrame";
import { TrashIcon } from "@heroicons/react/24/outline";
import DashBoardModal from "@/pages/dashboard/_components/ui/Modal";

export default function GenreSelect() {
  const { genres, selectGenre } = useAddSongContext();
  const modalRef = useRef<ModalRef>(null);

  const handleChoose = (genre: Genre) => {
    selectGenre(genre);
    closeModal();
  };

  const closeModal = () => modalRef.current?.close();

  return (
    <>
      <div className="space-y-2">
        <div className="text-lg">Genre</div>

        <Frame className="mt-1">
          {genres.length ? (
            <>
              <div className="flex flex-wrap -ml-2 -mt-2">
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
                  onClick={() => modalRef.current?.open()}
                  className="mt-2 ml-2 w-[37px] justify-center"
                  size={"clear"}
                >
                  <PlusIcon className="w-5" />
                </Button>
              </div>
            </>
          ) : (
            "..."
          )}
        </Frame>
      </div>

      <DashBoardModal ref={modalRef}>
        <GenreSearchModal closeModal={closeModal} choose={handleChoose} />
      </DashBoardModal>
    </>
  );
}

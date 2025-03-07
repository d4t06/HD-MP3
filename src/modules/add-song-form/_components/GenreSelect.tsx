import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import { Modal, ModalRef } from "@/components";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { Button, Frame } from "@/pages/dashboard/_components";
import GenreSearchModal from "./GenreSearchModal";

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
      <div className="space-y-1.5">
        <div className="flex space-x-2 items-center">
          <span>Genre</span>

          <Button
            onClick={() => modalRef.current?.open()}
            className={`p-1`}
            size={"clear"}
          >
            <PlusIcon className="w-5" />
          </Button>
        </div>

        <Frame className="flex flex-wrap space-x-2">
          {genres.length
            ? genres.map((g, i) => (
                <button
                  onClick={() => selectGenre(g)}
                  className="px-2 py-1 hover:border-red-300 rounded-md border border-black/10"
                  key={i}
                >
                  {g.name}
                </button>
              ))
            : "..."}
        </Frame>
      </div>

      <Modal wrapped={false} variant="animation" ref={modalRef}>
        <GenreSearchModal closeModal={closeModal} choose={handleChoose} />
      </Modal>
    </>
  );
}

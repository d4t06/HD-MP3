import {
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  NotFound,
} from "@/components";
import { Button, Frame, Loading } from "@/pages/dashboard/_components";
import AddGenreModal from "@/pages/dashboard/genre/_components/AddGenreModal";
import useGetGenre from "@/pages/dashboard/genre/_hooks/useGetGenre";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type Props = {
  closeModal: () => void;
  choose: (g: Genre) => void;
};

export default function MainGenreSelectModal({ closeModal, choose }: Props) {
  const { mains } = useGenreContext();

  const modalRef = useRef<ModalRef>(null);

  const closeAddSingerModal = () => modalRef.current?.close();

  const { api, isFetching } = useGetGenre();

  useEffect(() => {
    api();
  }, []);

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader title="Genre" close={closeModal} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {isFetching ? (
            <Loading className="h-full" />
          ) : (
            <>
              {mains.length ? (
                mains.map((genre, i) => (
                  <Frame
                    key={i}
                    onClick={() => {
                      choose(genre);
                      closeModal();
                    }}
                  >
                    <p className={`text-lg`}>{genre.name}</p>
                  </Frame>
                ))
              ) : (
                <>
                  <NotFound />
                </>
              )}
            </>
          )}
        </div>
        <p className="text-center mt-auto">
          <Button onClick={() => modalRef.current?.open()}>
            <PlusIcon className="w-6" />
            <span>Add new genre</span>
          </Button>
        </p>
      </ModalContentWrapper>

      <Modal ref={modalRef} variant="animation">
        <AddGenreModal
          afterSubmit={choose}
          type="add"
          isMain
          closeModal={closeAddSingerModal}
        />
      </Modal>
    </>
  );
}

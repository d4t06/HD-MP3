import { Modal, ModalHeader, ModalRef, NotFound } from "@/components";
import { Button, Frame, Loading, ModalWrapper } from "@/pages/dashboard/_components";
import Searchbar from "@/pages/dashboard/_components/SearchBar";
import { useSearchSinger } from "@/pages/dashboard/_hooks";
import QuickAddSingerModal from "@/pages/dashboard/singer/_components/QuickAddSingerModal";

import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";

type Props = {
  closeModal: () => void;
  choose: (s: Singer) => void;
};

export default function SingerSearchModal({ choose, closeModal }: Props) {
  const { result, isFetching, ...rest } = useSearchSinger({});

  const modalRef = useRef<ModalRef>(null);

  const closeAddSingerModal = () => modalRef.current?.close();

  return (
    <>
      <ModalWrapper>
        <ModalHeader title="Singers" close={closeModal} />
        <Searchbar {...rest} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {isFetching ? (
            <Loading className="h-full" />
          ) : (
            <>
              {result.length ? (
                result.map((singer, i) => (
                  <Frame key={i} onClick={() => choose(singer)}>
                    <p className={`text-lg`}>{singer.name}</p>
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
            <span>Add new singer</span>
          </Button>
        </p>
      </ModalWrapper>

      <Modal ref={modalRef} wrapped={false} variant="animation">
        <QuickAddSingerModal
          afterSubmit={choose}
          singerName={rest.value}
          closeModal={closeAddSingerModal}
        />
      </Modal>
    </>
  );
}

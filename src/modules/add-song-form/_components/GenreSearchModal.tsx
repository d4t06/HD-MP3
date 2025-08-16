import {
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  NotFound,
} from "@/components";
import {
  Button,
  Frame,
  DebounceSearchBar,
  Loading,
} from "@/pages/dashboard/_components";
import AddGenreModal from "@/pages/dashboard/genre/_components/AddGenreModal";
import useGetGenre from "@/pages/dashboard/genre/_hooks/useGetGenre";
import useSearchGenre from "@/pages/dashboard/genre/_hooks/useSearchGenre";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type Props = {
  closeModal: () => void;
  choose: (g: Genre) => void;
};
export default function GenreSearchModal({ closeModal, choose }: Props) {
  const { subs, ...rest } = useSearchGenre();

  const modalRef = useRef<ModalRef>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const closeAddSingerModal = () => modalRef.current?.close();

  const { api, isFetching } = useGetGenre();

  useEffect(() => {
    api();
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader title="Genre" closeModal={closeModal} />
        <DebounceSearchBar inputRef={inputRef} {...rest} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {isFetching ? (
            <Loading className="h-full" />
          ) : (
            <>
              {subs.length ? (
                subs.map((genre, i) => (
                  <button className="w-full text-left" key={i} onClick={() => choose(genre)}>
                    <Frame>
                      <p className={`text-lg`}>{genre.name}</p>
                    </Frame>
                  </button>
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
          genreName={rest.value}
          type="add"
          closeModal={closeAddSingerModal}
        />
      </Modal>
    </>
  );
}

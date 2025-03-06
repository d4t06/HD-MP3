import { Modal, ModalHeader, ModalRef, NotFound } from "@/components";
import { Button, Frame } from "@/components/dashboard";
import DebounceSearchBar from "@/components/dashboard/DeboundSearchBar";
import AddGenreModal from "@/components/dashboard/modals/AddGenreModal";
import Loading from "@/components/dashboard/ui/Loading";
import ModalWrapper from "@/components/dashboard/ui/ModalWrapper";
import useGetGenre from "@/hooks/dashboard/useGetGenre";
import useSearchGenre from "@/hooks/dashboard/useSearchGenre";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef } from "react";

type Props = {
  closeModal: () => void;
  choose: (g: Genre) => void;
};
export default function GenreSearchModal({ closeModal, choose }: Props) {
  const { _genres, ...rest } = useSearchGenre();

  const modalRef = useRef<ModalRef>(null);

  const closeAddSingerModal = () => modalRef.current?.close();

  const { shouldFetchGenre, api, isFetching, setIsFetching } = useGetGenre();

  useEffect(() => {
    if (shouldFetchGenre.current) {
      shouldFetchGenre.current = false;
      api();
    } else setIsFetching(false);
  }, []);

  return (
    <>
      <ModalWrapper>
        <ModalHeader title="Genre" close={closeModal} />
        <DebounceSearchBar {...rest} />

        <div className="h-[40vh] mt-3 space-y-1.5 overflow-auto">
          {isFetching ? (
            <Loading className="h-full" />
          ) : (
            <>
              {_genres.length ? (
                _genres.map((genre ,i) => (
                  <Frame key={i} onClick={() => choose(genre)}>
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
      </ModalWrapper>

      <Modal ref={modalRef} wrapped={false} variant="animation">
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

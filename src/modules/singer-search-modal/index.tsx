import {
  Modal,
  ModalContentWrapper,
  ModalHeader,
  ModalRef,
  NotFound,
  Tab,
} from "@/components";
import { Button, Loading, SearchBar } from "@/pages/dashboard/_components";

import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import useSingerSearchModal from "./useSingerSearchModal";
import QuickAddSingerModal from "./QuickAddSingerModal";
import { ArrowPathIcon } from "@heroicons/react/24/outline";

type Props = {
  closeModal: () => void;
  choose: (s: Singer) => void;
};

export default function SingerSearchModal({ choose, closeModal }: Props) {
  const {
    result,
    isShowResult,
    isFetching,
    setTab,
    getNewestSingers,
    tab,
    singers,
    tabs,
    ...rest
  } = useSingerSearchModal();

  const modalRef = useRef<ModalRef>(null);

  const renderSinger = (data: Singer[]) =>
    data.map((s, i) => (
      <button
        key={i}
        onClick={() => choose(s)}
        className="rounded-md w-full p-1 text-sm font-semibold text-left hover:bg-[--a-5-cl]"
      >
        {s.name}
      </button>
    ));

  return (
    <>
      <ModalContentWrapper>
        <ModalHeader title="Singers" closeModal={closeModal} />
        <SearchBar {...rest} />

        <Tab
          className="w-fit mt-3"
          buttonClasses="[&_button]:px-3 [&_button]:py-1/2"
          tabs={tabs}
          setTab={setTab}
          tab={tab}
          render={(t) => t}
        />

        <div className="h-[40vh] mt-2 space-y-1.5 overflow-auto bg-[--a-5-cl] p-2 rounded-md">
          {isFetching ? (
            <Loading className="h-full" />
          ) : (
            <>
              {tab === "Newest" && (
                <>
                  {singers.length ? (
                    renderSinger(singers)
                  ) : (
                    <NotFound variant="less" />
                  )}

                  <p className="text-center mt-3">
                    <Button onClick={getNewestSingers}>
                      <ArrowPathIcon className="w-5" />
                    </Button>
                  </p>
                </>
              )}

              {tab === "Result" && isShowResult && (
                <>
                  {result.length ? (
                    renderSinger(result)
                  ) : (
                    <NotFound variant="less" />
                  )}

                  {rest.value && (
                    <p className="text-center mt-auto mt-5">
                      <Button onClick={() => modalRef.current?.open()}>
                        <PlusIcon className="w-6" />
                        <span>Add new singer</span>
                      </Button>
                    </p>
                  )}
                </>
              )}
            </>
          )}
        </div>
      </ModalContentWrapper>

      <Modal ref={modalRef} variant="animation">
        <QuickAddSingerModal
          afterSubmit={choose}
          singerName={rest.value}
          modalRef={modalRef}
        />
      </Modal>
    </>
  );
}

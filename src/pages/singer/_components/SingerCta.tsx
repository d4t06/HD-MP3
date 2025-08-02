import {
  CopyLinkMenuItem,
  Modal,
  ModalContentWrapper,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  PopupWrapper,
  VerticalMenu,
} from "@/components";
import { useRef, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import PlaySingerSongBtn from "./PlayBtn";
import { useSingerContext } from "./SingerContext";
import HearBtn from "./HearBtn";

export default function SingerCta() {
  const [modal, setModal] = useState<"edit" | "delete" | "more" | "">("");
  const modalRef = useRef<ModalRef>(null);

  const { singer } = useSingerContext();

  const openModal = (m: typeof modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <button
        onClick={() => openModal("more")}
        className="text-sm ml-auto !mt-0"
      >
        See more
      </button>

      <div className="!mt-auto">
        <div className="flex items-end">
          <PlaySingerSongBtn />

          <div className="flex space-x-2 ml-3 [&_button]:p-2 [&_svg]:w-6 hover:[&_button]:bg-[--a-5-cl] [&_button]:rounded-full">
            <HearBtn />

            <MyPopup appendOnPortal>
              <MyPopupTrigger>
                <button>
                  <Bars3Icon />
                </button>
              </MyPopupTrigger>

              <MyPopupContent position="right-bottom" origin="top left">
                <PopupWrapper className="w-[140px]">
                  <VerticalMenu>
                    <CopyLinkMenuItem />
                  </VerticalMenu>
                </PopupWrapper>
              </MyPopupContent>
            </MyPopup>
          </div>
        </div>
      </div>

      {modal && (
        <Modal ref={modalRef} variant="animation">
          {modal === "more" && singer && (
            <ModalContentWrapper>{singer.description}</ModalContentWrapper>
          )}
        </Modal>
      )}
    </>
  );
}

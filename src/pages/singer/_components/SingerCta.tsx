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
import PlaySingerSongBtn from "./PlayBtn";
import { useSingerContext } from "./SingerContext";
import HearBtn from "./HearBtn";
import { threeDotsIcon } from "@/assets/icon";
import { useAuthContext } from "@/stores";

export default function SingerCta() {
  const { singer } = useSingerContext();
  const { user } = useAuthContext();

  const [modal, setModal] = useState<"edit" | "delete" | "more" | "">("");
  const modalRef = useRef<ModalRef>(null);

  const openModal = (m: typeof modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <button
        onClick={() => openModal("more")}
        className="text-sm font-bold ml-auto !mt-1"
      >
        See more
      </button>

      <div className="!mt-auto">
        <div className="flex items-end">
          <PlaySingerSongBtn />

          <div className="flex space-x-2 ml-3 [&_button]:p-2 [&_svg]:w-6 hover:[&_button]:bg-[--a-5-cl] [&_button]:rounded-full">
            {user && <HearBtn />}

            <MyPopup appendOnPortal>
              <MyPopupTrigger>
                <button>{threeDotsIcon}</button>
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

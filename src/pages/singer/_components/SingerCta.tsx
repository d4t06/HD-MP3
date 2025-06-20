import {
  CopyLinkMenuItem,
  Modal,
  ModalContentWrapper,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  PopupWrapper,
} from "@/components";
import { useRef, useState } from "react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import PlaySingerSongBtn from "./PlayBtn";
import { useSingerContext } from "./SingerContext";
import { MenuList } from "@/components/ui/MenuWrapper";
import { useThemeContext } from "@/stores";
import HearBtn from "./HearBtn";

export default function SingerCta() {
  const { theme } = useThemeContext();
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
        <div className="space-x-2 flex items-end">
          <PlaySingerSongBtn />

          <HearBtn />

          <MyPopup>
            <MyPopupTrigger>
              <button
                className={`p-2 bg-${theme.alpha} hover:brightness-95 rounded-full`}
              >
                <Bars3Icon className="w-5" />
              </button>
            </MyPopupTrigger>

            <MyPopupContent appendTo="parent">
              <PopupWrapper theme={theme} p={"clear"} className="py-2">
                <MenuList className="w-[140px]">
                  <CopyLinkMenuItem />
                </MenuList>
              </PopupWrapper>
            </MyPopupContent>
          </MyPopup>
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

import {
  MenuWrapper,
  Modal,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
} from "@/components";
import AddSongsToPlaylistModal from "@/modules/add-songs-to-playlist";
import { Button } from "@/pages/dashboard/_components";
import { useThemeContext } from "@/stores";
import { Bars3Icon, PlusIcon } from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useCategoryDetailAction from "../_hooks/useCategoryDetailAction";

type Modal = "add" | "arrange";

export default function SongCta() {
  const { theme } = useThemeContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useCategoryDetailAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <MyPopup>
        <MyPopupTrigger>
          <Button size={"clear"} className={`${theme.content_bg} p-1.5`}>
            <Bars3Icon className="w-6" />
            <span className="hidden md:block">Menu</span>
          </Button>
        </MyPopupTrigger>

        <MyPopupContent className="top-[calc(100%+8px)]">
          <MenuWrapper className="w-[140px]">
            <VerticalMenu>
              <button onClick={() => openModal("add")}>
                <PlusIcon />
                <span>Add songs</span>
              </button>

              {/* <button onClick={() => openModal("arrange")}>
                <ArrowPathIcon />
                <span>Arrange</span>
              </button> */}
            </VerticalMenu>
          </MenuWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal variant="animation" ref={modalRef}>
        {modal === "add" && (
          <AddSongsToPlaylistModal
            closeModal={() => modalRef.current?.close()}
            isLoading={isFetching}
            submit={(songs) => action({ variant: "add-songs", songs })}
          />
        )}
      </Modal>
    </>
  );
}

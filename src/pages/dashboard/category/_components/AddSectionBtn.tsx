import {
  AddItem,
  MenuWrapper,
  Modal,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
} from "@/components";
import { Button } from "../../_components";
import { useThemeContext } from "@/stores";
import {
  FilmIcon,
  PlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useCategoryLobbyAction from "../hooks/useCategoryLobbyAction";
import { initCategorySection } from "@/utils/factory";

type Modal = "category" | "playlist";

export default function AddSectionBtn() {
  const { theme } = useThemeContext();

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useCategoryLobbyAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <MyPopup>
        <MyPopupTrigger>
          <Button size={"clear"} className={`${theme.content_bg} p-1.5`}>
            <PlusIcon className="w-6" />

            <span className="hidden md:block">Add new section</span>
          </Button>
        </MyPopupTrigger>

        <MyPopupContent className="top-[calc(100%+8px)]">
          <MenuWrapper className="w-[140px]">
            <VerticalMenu>
              <button onClick={() => openModal("category")}>
                <SquaresPlusIcon />
                <span>Category</span>
              </button>

              <button onClick={() => openModal("playlist")}>
                <FilmIcon />
                <span>Playlist</span>
              </button>
            </VerticalMenu>
          </MenuWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal variant="animation" ref={modalRef}>
        {modal && (
          <AddItem
            loading={isFetching}
            cbWhenSubmit={(v) =>
              action({
                type: "add-section",
                variant: modal,
                section: initCategorySection(v),
              })
            }
            closeModal={() => modalRef.current?.close()}
            title={
              modal === "category"
                ? "Add category section"
                : "Add playlist section"
            }
          />
        )}
      </Modal>
    </>
  );
}

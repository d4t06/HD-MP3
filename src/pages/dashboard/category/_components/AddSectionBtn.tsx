import {
  AddItem,
  PopupWrapper,
  Modal,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
} from "@/components";
import { Button } from "../../_components";
import {
  FilmIcon,
  PlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useSectionAction from "../hooks/useSectionAction";
import { initPageSection } from "@/utils/factory";

type Modal = "category" | "playlist";

export default function AddSectionBtn() {
  const TARGET_PAGE = location.hash.includes("homepage") ? "home" : "category";

  const [modal, setModal] = useState<Modal | "">("");

  const modalRef = useRef<ModalRef>(null);

  const { action, isFetching } = useSectionAction({ modalRef });

  const openModal = (m: Modal) => {
    setModal(m);
    modalRef.current?.open();
  };

  return (
    <>
      <MyPopup>
        <MyPopupTrigger>
          <Button size={"clear"} className={`p-1.5`}>
            <PlusIcon className="w-6" />

            <span>Add new section</span>
          </Button>
        </MyPopupTrigger>

        <MyPopupContent className="top-[calc(100%+8px)]">
          <PopupWrapper className="w-[140px]">
            <VerticalMenu>
              {TARGET_PAGE === "category" && (
                <button onClick={() => openModal("category")}>
                  <SquaresPlusIcon />
                  <span>Category</span>
                </button>
              )}

              <button onClick={() => openModal("playlist")}>
                <FilmIcon />
                <span>Playlist</span>
              </button>
            </VerticalMenu>
          </PopupWrapper>
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
                section: initPageSection(v),
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

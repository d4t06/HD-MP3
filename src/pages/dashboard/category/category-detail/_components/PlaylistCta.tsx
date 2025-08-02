import {
  ArrangeModal,
  PopupWrapper,
  Modal,
  ModalRef,
  MyPopup,
  MyPopupContent,
  MyPopupTrigger,
  VerticalMenu,
} from "@/components";
import { Button } from "@/pages/dashboard/_components";
import {
  ArrowPathIcon,
  Bars3Icon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useRef, useState } from "react";
import useCategoryDetailAction from "../_hooks/useCategoryDetailAction";
import { useCategoryContext } from "../CategoryContext";
import AddPlaylistsModal from "./AddPlaylistsModal";

type Modal = "add" | "arrange";

export default function PlaylistCta() {
  const { orderedPlaylists } = useCategoryContext();

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
          <Button size={"clear"} className={`p-1`}>
            <Bars3Icon className="w-6" />
            <span className="hidden md:block">Menu</span>
          </Button>
        </MyPopupTrigger>

        <MyPopupContent className="top-[calc(100%+8px)] right-0">
          <PopupWrapper className="w-[140px]">
            <VerticalMenu>
              <button onClick={() => openModal("add")}>
                <PlusIcon />
                <span>Add playlist</span>
              </button>

              <button
                disabled={orderedPlaylists.length < 2}
                onClick={() => openModal("arrange")}
              >
                <ArrowPathIcon />
                <span>Arrange</span>
              </button>
            </VerticalMenu>
          </PopupWrapper>
        </MyPopupContent>
      </MyPopup>

      <Modal variant="animation" ref={modalRef}>
        {modal === "add" && (
          <AddPlaylistsModal
            current={orderedPlaylists.map((p) => p.id)}
            closeModal={() => modalRef.current?.close()}
            isLoading={isFetching}
            submit={(playlists) =>
              action({ variant: "add-playlists", playlists })
            }
          />
        )}

        {modal === "arrange" && (
          <ArrangeModal
            closeModal={() => modalRef.current?.close()}
            isLoading={isFetching}
            data={orderedPlaylists.map((p) => ({ id: p.id, label: p.name }))}
            submit={(order) =>
              action({
                variant: "arrange-playlist",
                category: { playlist_ids: order.join("_") },
              })
            }
          />
        )}
      </Modal>
    </>
  );
}

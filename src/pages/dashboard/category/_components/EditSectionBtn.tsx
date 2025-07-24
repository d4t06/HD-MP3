import { PencilIcon } from "@heroicons/react/24/outline";
import { Button } from "../../_components";
import { AddItem, Modal, ModalRef } from "@/components";
import useCategoryLobbyAction from "../hooks/useCategoryAction";
import { useRef } from "react";

type Props = {
  variant: "category" | "playlist";
  name: string;
  index: number;
};

export default function EditSectionBtn({ name, index, variant }: Props) {
  const { action, isFetching } = useCategoryLobbyAction();

  const modalRef = useRef<ModalRef>(null);

  return (
    <>
      <Button  onClick={() => modalRef.current?.open()} className="p-1.5" size={"clear"}>
        <PencilIcon className="w-6" />
      </Button>

      <Modal variant="animation" ref={modalRef}>
        <AddItem
          initValue={name}
          loading={isFetching}
          cbWhenSubmit={(v) =>
            action({
              type: "edit-section",
              index,
              section: { name: v },
              variant,
            })
          }
          closeModal={() => modalRef.current?.close()}
          title={
            variant === "category"
              ? "Edit category section"
              : "Edit playlist section"
          }
        />
      </Modal>
    </>
  );
}

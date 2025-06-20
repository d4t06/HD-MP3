import { Modal, ModalRef } from "@/components";

import { ComponentProps, forwardRef, Ref } from "react";

function DashBoardModal(
  { children, ...props }: ComponentProps<typeof Modal>,
  ref: Ref<ModalRef>,
) {
  return (
    <Modal variant="animation" {...props} ref={ref}>
      {children}
    </Modal>
  );
}

export default forwardRef(DashBoardModal);

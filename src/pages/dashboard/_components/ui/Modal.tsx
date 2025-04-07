import { Modal, ModalRef } from "@/components";
import { ModalWrapper } from ".";

import { ComponentProps, forwardRef, Ref } from "react";

function DashBoardModal(
	{ children, ...props }: ComponentProps<typeof Modal>,
	ref: Ref<ModalRef>,
) {
	return (
		<Modal variant="animation" wrapped={false} {...props} ref={ref}>
			<ModalWrapper>{children}</ModalWrapper>
		</Modal>
	);
}

export default forwardRef(DashBoardModal);

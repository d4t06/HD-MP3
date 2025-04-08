import { ModalRef } from "@/components";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import EditAlbumModal from "./EditAlbumModal";

export default function EditAlbumBtn() {
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<Button onClick={() => modalRef.current?.open()}>
				<PencilIcon className="w-6" />
				<span>Edit</span>
			</Button>

			<DashboardModal ref={modalRef}>
				<EditAlbumModal closeModal={() => modalRef.current?.close()} />
			</DashboardModal>
		</>
	);
}

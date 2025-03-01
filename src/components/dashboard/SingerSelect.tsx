import { PlusIcon } from "@heroicons/react/20/solid";
import { Button } from "..";
import { useTheme } from "@/store";
import { useAddSongContext } from "@/store/dashboard/AddSongContext";
import { useRef } from "react";
import Modal, { ModalRef } from "../Modal";

export default function SingerSelect() {
	const { theme } = useTheme();
	const { songData } = useAddSongContext();

	const modalRef = useRef<ModalRef>(null)

	return (
		<>
			<div className="space-y-1.5">
				<div className="flex space-x-2 items-center">
					<span>Singer</span>

					<Button color="primary" className={`p-1`} size={"clear"}>
						<PlusIcon className="w-5" />
					</Button>
				</div>

				<div className={`bg-${theme.alpha} p-2 rounded`}></div>
			</div>

			<Modal variant="animation" ref={modalRef}>
					
			</Modal>
		</>
	);
}

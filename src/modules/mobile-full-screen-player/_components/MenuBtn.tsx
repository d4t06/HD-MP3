import { ModalRef } from "@/components";
import SlideModal from "@/components/SlideModal";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import ControlMenu from "./ControlMenu";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePlayerContext } from "@/stores";

export default function MenuButton() {
	const { setIsOpenFullScreen } = usePlayerContext();
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<div className="flex space-x-1 items-center">
				<button className="p-1.5" onClick={() => modalRef.current?.open()}>
					<Bars3Icon className="w-6" />
				</button>

				<button onClick={() => setIsOpenFullScreen(false)} className="p-1.5">
					<ChevronDownIcon className="w-6" />
				</button>
			</div>

			<SlideModal ref={modalRef}>
				<ControlMenu />
			</SlideModal>
		</>
	);
}

import { ModalRef } from "@/components";
import SlideModal from "@/components/SlideModal";
import { Bars3Icon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import ControlMenu from "./ControlMenu";
import { ChatBubbleLeftRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePlayerContext } from "@/stores";
import MobileSongComment from "@/modules/comment/components/MobileSongComment";
import { useCommentContext } from "@/modules/comment/components/CommemtContext";
import useGetSongComment from "@/modules/comment/hooks/useGetSongComment";

export default function MenuButton() {
	const { setIsOpenFullScreen } = usePlayerContext();
	const { setIsOpenComment } = useCommentContext();

	const modalRef = useRef<ModalRef>(null);

	const commentModalRef = useRef<ModalRef>(null);

	useGetSongComment();

	const handleOpenCommentPopup = () => {
		commentModalRef.current?.open();
		setIsOpenComment(true);
	};

	return (
		<>
			<div className="flex space-x-1 items-center">
				<button className="p-1.5" onClick={handleOpenCommentPopup}>
					<ChatBubbleLeftRightIcon className="w-6" />
				</button>

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

			<SlideModal onClose={() => setIsOpenComment(false)} ref={commentModalRef}>
				<MobileSongComment />
			</SlideModal>
		</>
	);
}

import {
	Button,
	Modal,
	ModalContentWrapper,
	ModalHeader,
	ModalRef,
	MyPopup,
	MyPopupContent,
	MyPopupTrigger,
} from "@/components";
import { MenuList, MenuWrapper } from "@/components/ui/MenuWrapper";
import { useThemeContext } from "@/stores";
import { useRef, useState } from "react";
import AddSongBeatModal from "./AddSongBeatModal";
import {
	ArrowTopRightOnSquareIcon,
	Bars3Icon,
	MusicalNoteIcon,
	PencilIcon,
	QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { TriggerRef } from "@/components/MyPopup";
import EditStringLyicModal from "./EditStringLyricModal";
import { useEditLyricContext } from "./EditLyricContext";

type Modal = "lyric" | "tutorial" | "song-beat";

type Props = {
	pause: () => void;
};

export default function MenuBtn({ pause }: Props) {
	const { theme } = useThemeContext();
	const { song } = useEditLyricContext();

	const [modal, setModal] = useState<Modal | "">("");

	const modalRef = useRef<ModalRef>(null);
	const triggerRef = useRef<TriggerRef>(null);

	const openModal = (m: Modal) => {
		pause();
		setModal(m);
		modalRef.current?.open();
		triggerRef.current?.close();
	};

	const closeModal = () => modalRef.current?.close();

	const renderModal = () => {
		if (!modal) return;

		switch (modal) {
			case "lyric":
				return <EditStringLyicModal closeModal={closeModal} />;
			case "tutorial":
				return (
					<ModalContentWrapper className="w-[500px] ">
						<ModalHeader title="Tutorial" close={closeModal} />
						<div className="h-[500px] max-h-[75vh] overflow-y-auto no-scrollbar">
							<img className="w-full border rounded-[16px]" src="" alt="" />
						</div>
					</ModalContentWrapper>
				);
			case "song-beat":
				return song && <AddSongBeatModal closeModal={closeModal} />;
		}
	};

	return (
		<>
			<MyPopup>
				<MyPopupTrigger ref={triggerRef}>
					<Button
						size={"clear"}
						className={`${theme.content_bg} h-[36px] w-[36px] justify-center rounded-full mt-2`}
					>
						<Bars3Icon className="w-6" />
					</Button>
				</MyPopupTrigger>

				<MyPopupContent className="top-[calc(100%+8px)] right-0 z-[9]" appendTo="parent">
					<MenuWrapper className="w-[140px]">
						<MenuList>
							<button onClick={() => openModal("lyric")}>
								<PencilIcon className="w-5" />

								<span>Edit lyric</span>
							</button>
							<button onClick={() => openModal("tutorial")}>
								<QuestionMarkCircleIcon className="w-5" />

								<span>Tutorial</span>
							</button>
							<button onClick={() => openModal("song-beat")}>
								<MusicalNoteIcon className="w-5" />
								<span>Song beat</span>
							</button>

							<button onClick={() => openModal("song-beat")}>
								<ArrowTopRightOnSquareIcon className="w-5" />
								<span>Export</span>
							</button>
						</MenuList>
					</MenuWrapper>
				</MyPopupContent>
			</MyPopup>

			<Modal variant="animation" ref={modalRef}>
				{renderModal()}
			</Modal>
		</>
	);
}

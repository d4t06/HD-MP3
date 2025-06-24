import { Modal, ModalRef } from "@/components";
import AddSongToPlaylistModal from "@/modules/song-menu/_components/AddSongToPlaylistModal";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

type Props = {
	song: Song;
};

export default function AddToPlaylistBtn({ song }: Props) {
	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<div>
				<button onClick={() => modalRef.current?.open()}>
					<PlusIcon className="w-6" />
				</button>
				<span>Add to playlist</span>
			</div>

			<Modal variant="animation" ref={modalRef}>
				<AddSongToPlaylistModal
					closeModal={() => modalRef.current?.close()}
					songs={[song]}
				/>
			</Modal>
		</>
	);
}

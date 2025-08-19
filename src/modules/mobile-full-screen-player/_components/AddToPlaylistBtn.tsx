import { plusIcon } from "@/assets/icon";
import { Modal, ModalRef } from "@/components";
import AddSongToPlaylistModal from "@/modules/song-menu/_components/AddSongToPlaylistModal";
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
					<p className="w-6">{plusIcon}</p>
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

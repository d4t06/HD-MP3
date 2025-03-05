import { RefObject } from "react";
import useAddSongToPlaylist from "../_hooks/useAddSongToPlaylist";
import { AddItem, Modal, ModalRef } from "@/components";

type Props = {
	song: Song;
	modalRef: RefObject<ModalRef>;
};

export default function AddSongToNewPlaylistModal({ song, modalRef }: Props) {
	const closeModal = () => modalRef.current?.close();

	const { addToPlaylist, isFetching } = useAddSongToPlaylist();

	const handleAddPlaylist = async (name: string) => {
		await addToPlaylist({ variant: "create", name, song });

		modalRef.current?.close();
	};

	return (
		<Modal ref={modalRef} variant="animation">
			<AddItem
				loading={isFetching}
				closeModal={closeModal}
				cbWhenSubmit={(v) => handleAddPlaylist(v)}
				title="Add to new playlist"
			/>
		</Modal>
	);
}

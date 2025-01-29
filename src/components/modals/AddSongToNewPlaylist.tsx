import { RefObject } from "react";
import Modal, { ModalRef } from "../Modal";
import AddItem from "./AddItem";
import useAddSongToNewPlaylist from "./_hooks/useAddSongToPlaylist";

type Props = {
	song: Song;
	modalRef: RefObject<ModalRef>;
};

export default function AddSongToNewPlaylist({ song, modalRef }: Props) {
	const closeModal = () => modalRef.current?.close();

	const { addToPlaylist, isFetching } = useAddSongToNewPlaylist();

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

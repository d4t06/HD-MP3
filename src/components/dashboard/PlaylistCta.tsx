import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button, ConfirmModal, Modal } from "..";
import { useTheme } from "@/store";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useRef, useState } from "react";
import { ModalRef } from "../Modal";
import SongSelectProvider from "@/store/SongSelectContext";
import AddSongToPlaylistModal from "./AddSongToPlaylistModal";
import AddItem from "../modals/AddItem";
import useDashboardPlaylistActions from "@/hooks/dashboard/useDashboardPlaylistActions";

type Modal = "edit" | "delete" | "add-song-to-playlist";

export default function DashboardPlaylistCta() {
	const { theme } = useTheme();

	const [modal, setModal] = useState<Modal | "">("");

	const modalRef = useRef<ModalRef>(null);

	const { deletePlaylist, editPlaylist, currentPlaylist, isFetching } =
		useDashboardPlaylistActions();

	const openModal = (m: Modal) => {
		setModal(m);
		if (modal === "add-song-to-playlist") modalRef.current?.setModalPersist(true);

		modalRef.current?.open();
	};
	const closeModal = () => modalRef.current?.close();

	type DeletePlaylist = {
		variant: "delete";
	};

	type EditPlaylist = {
		variant: "edit";
		value: string;
	};

	const handlePlaylistAction = async (props: DeletePlaylist | EditPlaylist) => {
		switch (props.variant) {
			case "delete":
				await deletePlaylist();
				break;
			case "edit":
				await editPlaylist(props.value);
				break;
		}

		closeModal();
	};

	const renderModal = () => {
		switch (modal) {
			case "":
				return <></>;
			case "edit":
				return (
					<>
						{currentPlaylist && (
							<AddItem
								cbWhenSubmit={(v) => handlePlaylistAction({ variant: "edit", value: v })}
								initValue={currentPlaylist.name}
								title="Edit playlist"
								variant="input"
								loading={isFetching}
								closeModal={closeModal}
							/>
						)}
					</>
				);

			case "delete":
				return (
					<ConfirmModal
						loading={isFetching}
						label={"Delete playlist ?"}
						theme={theme}
						callback={() => handlePlaylistAction({ variant: "delete" })}
						close={closeModal}
					/>
				);

				break;

			case "add-song-to-playlist":
				return (
					<SongSelectProvider>
						<AddSongToPlaylistModal closeModal={closeModal} />
					</SongSelectProvider>
				);
		}
	};

	const classes = {
		button: "rounded-full p-2.5",
	};

	return (
		<>
			<Button
				onClick={() => openModal("edit")}
				size={"clear"}
				className={`${classes.button} bg-${theme.alpha}`}
			>
				<PencilIcon className="w-5" />
			</Button>

			<Button
				onClick={() => openModal("delete")}
				size={"clear"}
				className={`${classes.button} bg-${theme.alpha}`}
			>
				<TrashIcon className="w-5" />
			</Button>

			<Button
				onClick={() => openModal("add-song-to-playlist")}
				size={"clear"}
				className={`${classes.button} space-x-1 ${theme.content_bg}`}
			>
				<PlusIcon className="w-5" />
				<span>Add song</span>
			</Button>

			<Modal variant="animation" ref={modalRef}>
				{renderModal()}
			</Modal>
		</>
	);
}

import {
	AdjustmentsHorizontalIcon,
	PauseIcon,
	PencilIcon,
	PlayIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, ConfirmModal, Modal } from ".";
import MyPopup, { MyPopupContent, MyPopupTrigger, TriggerRef } from "@/components/MyPopup";

import { useTheme } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";
import { selectSongQueue } from "@/store/songQueueSlice";
import { selectAllPlayStatusStore, setPlayStatus } from "@/store/PlayStatusSlice";
import { ReactNode, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useSetSong from "@/hooks/useSetSong";
import { MenuWrapper, MenuList } from "./ui/MenuWrapper";
import EditPlaylist from "./modals/EditPlaylist";
import { ModalRef } from "./Modal";

const PlayPlaylistBtn = ({
	onClick,
	children,
	disable,
	text,
}: {
	children: ReactNode;
	text: string;
	onClick: () => void;
	disable?: boolean;
}) => {
	const { theme } = useTheme();

	return (
		<Button
			onClick={onClick}
			size={"clear"}
			disabled={disable}
			className={`rounded-full px-5 py-1 ${theme.content_bg}`}
		>
			{children}
			<span className="font-playwriteCU leading-[2.2]">{text}</span>
		</Button>
	);
};

type Props = {
	variant: "my-playlist" | "sys-playlist" | "dashboard-playlist";
};

type Modal = "edit" | "delete";

export default function PlaylistInfoCta({ variant }: Props) {
	const dispatch = useDispatch();

	const { theme } = useTheme();

	const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
	const { currentSongData } = useSelector(selectSongQueue);
	const { playStatus } = useSelector(selectAllPlayStatusStore);

	const [modal, setModal] = useState<Modal | "">("");

	const modalRef = useRef<ModalRef>();
	const triggerRef = useRef<TriggerRef>()

	const params = useParams();
	const { handleSetSong } = useSetSong({ variant: "playlist" });

	const openModal = (m: Modal) => {
		setModal(m);

		triggerRef.current?.close()
		modalRef.current?.open();
	};
	const closeModal = () => modalRef.current?.close();

	const handlePlayPlaylist = () => {
		if (currentSongData?.song.song_in.includes(params.name as string)) return;
		const firstSong = playlistSongs[0];
		handleSetSong(firstSong.queue_id, playlistSongs);
	};

	const handlePlayPause = () => {
		switch (playStatus) {
			case "playing":
				return dispatch(setPlayStatus({ triggerPlayStatus: "paused" }));
			case "paused":
				return dispatch(setPlayStatus({ triggerPlayStatus: "playing" }));
		}
	};

	const renderPlayPlaylistBtn = () => {
		if (!currentPlaylist) return <></>;

		if (currentSongData?.song.song_in.includes(currentPlaylist.id)) {
			switch (playStatus) {
				case "playing":
				case "waiting":
					return (
						<PlayPlaylistBtn text="Pause" onClick={handlePlayPause}>
							<PauseIcon className="w-7 mr-1" />
						</PlayPlaylistBtn>
					);
				case "loading":
				case "paused":
					return (
						<PlayPlaylistBtn text="Continue Play" onClick={handlePlayPause}>
							<PlayIcon className="w-7 mr-1" />
						</PlayPlaylistBtn>
					);
			}
		}

		return (
			<PlayPlaylistBtn text="Play" onClick={handlePlayPlaylist}>
				<PlayIcon className="w-7 mr-1" />
			</PlayPlaylistBtn>
		);
	};

	const renderMenu = () => {
		switch (variant) {
			case "my-playlist":
				return (
					<>
						<button onClick={() => openModal("delete")}>
							<TrashIcon className="w-5" />
							<span>Delete</span>
						</button>

						<button onClick={() => openModal("edit")}>
							<PencilIcon className="w-5" />
							<span>Edit</span>
						</button>
					</>
				);

			case "dashboard-playlist":
				return (
					<>
						<button onClick={() => openModal("delete")}>
							<TrashIcon className="w-5" />
							<span>Delete</span>
						</button>

						<button onClick={() => openModal("edit")}>
							<PencilIcon className="w-5" />
							<span>Edit</span>
						</button>
					</>
				);

			default:
				return <></>;
		}
	};

	const renderModal = () => {
		switch (modal) {
			case "":
				return <></>;
			case "edit":
				if (currentPlaylist)
					return <EditPlaylist close={closeModal} playlist={currentPlaylist} />;
				else return <></>;

			case "delete":
				if (variant === "my-playlist")
					return (
						<ConfirmModal
							loading={false}
							label={"Delete playlist ?"}
							theme={theme}
							callback={() => {}}
							close={closeModal}
						/>
					);
				if (variant === "dashboard-playlist")
					return (
						<ConfirmModal
							loading={false}
							label={"Delete playlist ?"}
							theme={theme}
							callback={() => {}}
							close={closeModal}
						/>
					);
		}
	};

	const renderContent = () => {
		switch (variant) {
			case "my-playlist":
			case "dashboard-playlist":
				return (
					<>
						{renderPlayPlaylistBtn()}
						<MyPopup>
							<MyPopupTrigger ref={triggerRef}>
								<Button
									size={"clear"}
									className={`rounded-full p-2.5 ${theme.content_hover_bg} bg-${theme.alpha}`}
								>
									<AdjustmentsHorizontalIcon className="w-6" />
								</Button>
							</MyPopupTrigger>

							<MyPopupContent className="min-w-[140px]" appendTo="parent">
								{/*<PopupWrapper theme={theme}>*/}
								<MenuWrapper>
									<MenuList>{renderMenu()}</MenuList>
								</MenuWrapper>
								{/*</PopupWrapper>*/}
							</MyPopupContent>
						</MyPopup>
					</>
				);

			default:
				return renderPlayPlaylistBtn();
		}
	};

	return (
		<>
			{renderContent()}
			<Modal variant="animation" ref={modalRef}>{renderModal()}</Modal>
		</>
	);
}

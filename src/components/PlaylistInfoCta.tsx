import {
	AdjustmentsHorizontalIcon,
	PauseIcon,
	PencilIcon,
	PlayIcon,
	TrashIcon,
} from "@heroicons/react/24/outline";
import { Button, ConfirmModal, Modal } from ".";
import MyPopup, {
	MyPopupContent,
	MyPopupTrigger,
	TriggerRef,
} from "@/components/MyPopup";

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
import usePlaylistAction from "@/hooks/usePlaylistAction";

type PlayBtnProps = {
	children: ReactNode;
	text: string;
	onClick: () => void;
};

function PlayBtn({ onClick, children, text }: PlayBtnProps) {
	const { theme } = useTheme();

	return (
		<Button
			onClick={onClick}
			size={"clear"}
			className={`rounded-full px-5 py-1 ${theme.content_bg}`}
		>
			{children}
			<span className="font-playwriteCU leading-[2.2]">{text}</span>
		</Button>
	);
}

function PlayPlaylistBtn() {
	const dispatch = useDispatch();
	const { currentPlaylist, playlistSongs } = useSelector(selectCurrentPlaylist);
	const { currentSongData } = useSelector(selectSongQueue);
	const { playStatus } = useSelector(selectAllPlayStatusStore);

	const params = useParams();
	const { handleSetSong } = useSetSong({ variant: "playlist" });

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

	if (!currentPlaylist) return <></>;

	if (currentSongData?.song.song_in.includes(currentPlaylist.id)) {
		switch (playStatus) {
			case "playing":
			case "waiting":
				return (
					<PlayBtn text="Pause" onClick={handlePlayPause}>
						<PauseIcon className="w-7 mr-1" />
					</PlayBtn>
				);
			case "loading":
			case "paused":
				return (
					<PlayBtn text="Continue Play" onClick={handlePlayPause}>
						<PlayIcon className="w-7 mr-1" />
					</PlayBtn>
				);
		}
	}

	return (
		<PlayBtn text="Play" onClick={handlePlayPlaylist}>
			<PlayIcon className="w-7 mr-1" />
		</PlayBtn>
	);
}

type Modal = "edit" | "delete";

function UserCta() {
	const { theme } = useTheme();

	const { currentPlaylist } = useSelector(selectCurrentPlaylist);

	const [modal, setModal] = useState<Modal | "">("");
	const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

	const modalRef = useRef<ModalRef>(null);
	const triggerRef = useRef<TriggerRef>(null);

	const { action, isFetching } = usePlaylistAction();

	const openModal = (m: Modal) => {
		setModal(m);

		triggerRef.current?.close();
		modalRef.current?.open();
	};
	const closeModal = () => modalRef.current?.close();

	const renderModal = () => {
		if (!currentPlaylist) return <></>;

		switch (modal) {
			case "":
				return <></>;
			case "edit":
				return <EditPlaylist close={closeModal} playlist={currentPlaylist} />;

			case "delete":
				return (
					<ConfirmModal
						loading={isFetching}
						label={`Delete playist ' ${currentPlaylist.name} ' ?`}
						theme={theme}
						callback={() =>
							action({
								variant: "delete",
							})
						}
						close={closeModal}
					/>
				);
		}
	};

	return (
		<>
			<MyPopup>
				<MyPopupTrigger setIsOpenParent={setIsOpenPopup} ref={triggerRef}>
					<Button
						size={"clear"}
						className={`rounded-full p-2.5 ${isOpenPopup ? theme.content_bg : ""} ${theme.content_hover_bg} bg-${theme.alpha}`}
					>
						<AdjustmentsHorizontalIcon className="w-6" />
					</Button>
				</MyPopupTrigger>

				<MyPopupContent
					className="left-[calc(100%)]"
					animationClassName="origin-top-left"
					appendTo="parent"
				>
					<MenuWrapper>
						<MenuList>
							<button onClick={() => openModal("edit")}>
								<PencilIcon className="w-5" />
								<span>Edit</span>
							</button>

							<button onClick={() => openModal("delete")}>
								<TrashIcon className="w-5" />
								<span>Delete</span>
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

type Props = {
	variant: "my-playlist" | "sys-playlist";
};
export default function PlaylistInfoCta({ variant }: Props) {
	switch (variant) {
		case "sys-playlist":
			return <PlayPlaylistBtn />;
		case "my-playlist":
			return (
				<>
					<PlayPlaylistBtn />
					<UserCta />
				</>
			);
	}
}

import { useSongContext, useTheme } from "@/store";
import { MusicalNoteIcon, PlusIcon } from "@heroicons/react/24/outline";
import { PopupWrapper } from "..";
import { MenuList } from "../ui/MenuWrapper";
import { RefObject } from "react";
import { ModalRef } from "../Modal";
import { usePopoverContext } from "../MyPopup";
import useAddPlaylistMenuItem from "@/hooks/useAddToPlaylistMenuItem";

type Props = {
	addSongToNewPlaylistModalRef: RefObject<ModalRef>;
	addSongToPlaylistModalRef?: RefObject<ModalRef>;
	song: Song;
};

// this component only use insize popup component
export default function AddToPlaylistMenuItem({
	addSongToNewPlaylistModalRef,
	addSongToPlaylistModalRef,
	song,
}: Props) {
	const { isOnMobile, theme } = useTheme();
	const { playlists } = useSongContext();
	const { close } = usePopoverContext();

	const { isFetching, addToPlaylist } = useAddPlaylistMenuItem();

	const openAddToNewPlaylistModal = () => {
		addSongToNewPlaylistModalRef.current?.open();
		close();
	};

	const openAddToPlaylistModal = () => {
		addSongToPlaylistModalRef?.current?.open();
		close();
	};

	const classes = {
		overlay: "absolute flex items-center justify-center inset-0 bg-black/40",
	};

	if (isOnMobile)
		return (
			<button onClick={openAddToPlaylistModal}>
				<PlusIcon className="w-5" />
				<span>Add to playlist</span>
			</button>
		);

	return (
		<>
			<div className={`group/add-playlist relative`}>
				<PlusIcon className="w-5" />
				<span>Add to playlist</span>
				<PopupWrapper
					className={`absolute z-[99] overflow-hidden py-2 right-full w-full hidden group-hover/add-playlist:block`}
					theme={theme}
					p={"clear"}
				>
					<MenuList>
						<button onClick={openAddToNewPlaylistModal}>
							<span
								className={` inline-flex items-center mr-1 p-1 rounded-full ${theme.content_bg}`}
							>
								<PlusIcon className="w-4" />
							</span>
							<span>Add new playlist</span>
						</button>

						{!!playlists?.length &&
							playlists.map((playlist, index) => {
								return (
									<button
										onClick={() =>
											addToPlaylist({
												song,
												playlist,
											})
										}
										key={index}
									>
										<MusicalNoteIcon className="w-5" />
										<p className="line-clamp-1">{playlist.name}</p>
									</button>
								);
							})}
					</MenuList>

					{isFetching && (
						<div className={classes.overlay}>
							<div
								className={`h-[25px] w-[25px] border-[2px] border-r-black rounded-[50%] animate-spin`}
							></div>
						</div>
					)}
				</PopupWrapper>
			</div>
		</>
	);
}

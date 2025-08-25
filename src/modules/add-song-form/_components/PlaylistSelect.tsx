import { Modal, ModalRef } from "@/components";
import { Button, ItemRightCtaFrame } from "@/pages/dashboard/_components";
import AddPlaylistsModal from "@/pages/dashboard/category/category-detail/_components/AddPlaylistsModal";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";

export default function PlaylistSelect() {
	const { playlists, setPlaylists, removePlaylist } = useAddSongContext();

	const modalRef = useRef<ModalRef>(null);

	const addPlaylist = (p: Playlist[]) => {
		setPlaylists((prev) => [...prev, ...p]);
	};

	return (
		<>
			<div>
				<div>Playlist</div>

				<div className="-ml-2 flex flex-wrap">
					{playlists.map((s, i) => (
						<ItemRightCtaFrame key={i}>
							<span>{s.name}</span>

							<div className="flex">
								<button onClick={() => removePlaylist(i)}>
									<TrashIcon className="w-5" />
								</button>
							</div>
						</ItemRightCtaFrame>
					))}

					<Button
						onClick={() => modalRef.current?.open()}
						className="mt-2 ml-2 h-[38px] w-[38px] justify-center"
						size={"clear"}
					>
						<PlusIcon className="w-5" />
					</Button>
				</div>
			</div>

			<Modal variant="animation" ref={modalRef}>
				<AddPlaylistsModal
					closeModal={() => modalRef.current?.close}
					current={playlists.map((p) => p.id)}
					submit={(p) => {
						addPlaylist(p);
						modalRef.current?.close();
					}}
					isLoading={false}
				/>
			</Modal>
		</>
	);
}

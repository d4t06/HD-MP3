import { useAddAlbumContext } from "@/modules/add-album-form/_components/AddAlbumContext";
import { PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { ModalRef } from "@/components";
import { useRef } from "react";
import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { Button, DashboardModal } from "@/pages/dashboard/_components";
import AddSongsToPlaylistModal from "@/modules/add-songs-to-playlist";

export default function AlbumSongSelect() {
	const { songs, setSongs } = useAddAlbumContext();

	const modalRef = useRef<ModalRef>(null);

	const handleSetSongs = (_songs: Song[]) => {
		const songIds = songs.map((s) => s.id);

		const filterdSelectedSongs = _songs.filter((s) => !songIds.includes(s.id));

		setSongs([...songs, ...filterdSelectedSongs]);
	};

	const removeSong = (song: Song) => {
		const newSongs = songs.filter((s) => s.id !== song.id);

		setSongs(newSongs);
	};

	return (
		<>
			<div>
				<p className="text-lg mb-1">Songs</p>
				<DashboardTable colList={["Name", "Singer", ""]}>
					{songs.map((s, i) => (
						<tr key={i}>
							<td>
								<span>{s.name}</span>
							</td>
							<td>
								{s.singers.map((s, i) => (
									<span className="hover:underline" key={i}>
										{!!i && ", "}
										{s.name}
									</span>
								))}
							</td>

							<td>
								<Button onClick={() => removeSong(s)} size={"clear"} className="p-1">
									<TrashIcon className="w-5" />
								</Button>
							</td>
						</tr>
					))}

					<tr className="!bg-white">
						<td colSpan={3}>
							<p className="text-center">
								<Button onClick={() => modalRef.current?.open()}>
									<PlusIcon className="w-6" />
									<span>Add song</span>
								</Button>
							</p>
						</td>
					</tr>
				</DashboardTable>
			</div>

			<DashboardModal wrapped={false} variant="animation" ref={modalRef}>
				<AddSongsToPlaylistModal
					submit={handleSetSongs}
					closeModal={() => modalRef.current?.close()}
					isLoading={false}
				/>
			</DashboardModal>
		</>
	);
}

import DashboardTable from "@/pages/dashboard/_components/ui/Table";
import { useAlbumContext } from "../AlbumContext";
import { Link } from "react-router-dom";
import { ConfirmModal, Modal, ModalRef, NotFound, Title } from "@/components";
import { useSongSelectContext } from "@/stores";
import { CheckIcon } from "@heroicons/react/20/solid";
import { StopIcon, TrashIcon } from "@heroicons/react/24/outline";
import { Button } from "@/pages/dashboard/_components";
import useAlbumAction from "../_hooks/useAlbumAction";
import { useRef } from "react";

export default function AlbumSongSection() {
	const { songs } = useAlbumContext();

	const { selectedSongs, selectSong } = useSongSelectContext();

	const { action, isFetching } = useAlbumAction();

	const modalRef = useRef<ModalRef>(null);

	return (
		<>
			<div>
				<div className="flex justify-between items-center mb-3">
					<Title title={"Songs"} variant={"h2"} />

					{!!selectedSongs.length && (
						<Button
							onClick={() => modalRef.current?.open()}
							className="p-1"
							size={"clear"}
						>
							<TrashIcon className="w-5" />
						</Button>
					)}
				</div>

				<DashboardTable colList={["Name", "Singer", "Genre", ""]}>
					{songs.length ? (
						songs.map((s, i) => {
							const isSelected = selectedSongs.find((song) => song.id === s.id);

							return (
								<tr key={i} className={isSelected ? "bg-[--a-5-cl]" : ""}>
									<td>
										<Link
											to={`/dashboard/song/${s.id}/edit`}
											className="hover:underline"
										>
											{s.name}
										</Link>
									</td>
									<td>
										{s.singers.map((s, i) => (
											<Link
												className="hover:underline"
												to={`/dashboard/singer/${s.id}`}
												key={i}
											>
												{!!i && ", "}
												{s.name}
											</Link>
										))}
									</td>

									<td>{s.main_genre?.name}</td>

									<td>
										<button onClick={() => selectSong(s)}>
											{isSelected ? (
												<CheckIcon className="w-5" />
											) : (
												<StopIcon className="w-5" />
											)}
										</button>
									</td>
								</tr>
							);
						})
					) : (
						<tr>
							<td colSpan={4}>
								<NotFound variant="less" />
							</td>
						</tr>
					)}
				</DashboardTable>
			</div>

			<Modal variant="animation" ref={modalRef}>
				<ConfirmModal
					callback={() =>
						action({
							variant: "remove-songs",
							songs: selectedSongs,
						})
					}
					closeModal={() => modalRef.current?.close()}
					loading={isFetching}
					label="Remove selected songs ?"
				/>
			</Modal>
		</>
	);
}

import useAddSongToPlaylistModal from "@/hooks/dashboard/useAddSongToPlaylistModal";
import { useTheme } from "@/store";
import {
	ArrowPathIcon,
	MagnifyingGlassIcon,
	XMarkIcon,
} from "@heroicons/react/24/outline";
import { Button } from "..";
import ModalHeader from "../modals/ModalHeader";
import { useMemo } from "react";

type Props = {
	closeModal: () => void;
};

export default function AddSongToPlaylistModal({ closeModal }: Props) {
	const { theme } = useTheme();

	const {
		value,
		setValue,
		isFetching,
		songs,
		handleSubmit,
		selectedSongs,
		handleAddSongsToPlaylist,
		selectSong,
		actionFetching,
	} = useAddSongToPlaylistModal();

	const _handleAddSongsToPlaylist = async () => {
		await handleAddSongsToPlaylist();
		closeModal();
	};

	const otherSongs = useMemo(() => {
		const selectedSongsId = selectedSongs.map((s) => s.id);

		return songs.filter((s) => !selectedSongsId.includes(s.id));
	}, [songs, selectedSongs]);

	const classes = {
		col: "w-1/2 flex flex-col px-2",
		formGroup: ` flex bg-white/10 rounded-full overflow-hidden`,
		input: "outline-none bg-transparent px-3 py-1 h-full",
		box: `rounded-lg bg-white/10 overflow-hidden p-2`,
		songItem: `rounded-md w-full p-1 text-left`,
	};

	return (
		<div className="w-[700px] max-w-[85vw] h-[80vh] flex flex-col">
			<ModalHeader close={closeModal} title="Add song to playist" />

			<div className="flex-grow flex flex-col md:flex-row md:-mx-3 overflow-hidden">
				<div className={`${classes.col}`}>
					<form action="#" onSubmit={handleSubmit} className={`flex w-full`}>
						<div className={`${classes.formGroup}`}>
							<input
								value={value}
								placeholder="..."
								onChange={(e) => setValue(e.target.value.trim())}
								className={`${classes.input}`}
								type="text"
							/>
							<button
								type="button"
								onClick={() => setValue("")}
								className={`pr-2 ${
									!value ? "opacity-0 cursor-none" : "opacity-[1] cursor-pointer"
								}`}
							>
								<XMarkIcon className="w-5" />
							</button>
						</div>

						<Button
							type="submit"
							className={`${theme.content_bg} ml-3 w-[32px] justify-center h-full rounded-full `}
							size={"clear"}
						>
							<MagnifyingGlassIcon className="w-5" />
						</Button>
					</form>

					<div className={`${classes.box} flex-grow mt-3`}>
						<div className={`h-full overflow-auto space-y-2`}>
							{!isFetching ? (
								otherSongs.map((s, i) => (
									<button
										key={i}
										onClick={() => selectSong(s)}
										className={`${classes.songItem} bg-${theme.alpha} ${theme.content_hover_bg}`}
									>
										<h5 className="">{s.name}</h5>
										<p className=" text-sm">{s.singer}</p>
									</button>
								))
							) : (
								<ArrowPathIcon className="w-5 animate-spin" />
							)}
						</div>
					</div>
				</div>
				<div className={classes.col}>
					<div className="leading-[32px] font-[500]">Selected:</div>

					<div className={`${classes.box} flex-grow mt-3 space-y-2`}>
						{selectedSongs.map((s, i) => (
							<button
								key={i}
								onClick={() => selectSong(s)}
								className={`${classes.songItem} ${theme.content_bg} hover:bg-${theme.alpha}`}
							>
								<h5 className="">{s.name}</h5>
								<p className=" text-sm">{s.singer}</p>
							</button>
						))}
					</div>
				</div>
			</div>

			<p className="text-right mt-3">
				<Button
					isLoading={actionFetching}
					onClick={_handleAddSongsToPlaylist}
					className={`${theme.content_bg} rounded-full`}
					color=""
				>
					Add
				</Button>
			</p>
		</div>
	);
}

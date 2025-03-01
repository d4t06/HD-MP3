import { useThemeContext } from "@/stores";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import ModalHeader from "../modals/ModalHeader";
import { Button } from "..";
import useDashboardPlaylistActions from "@/hooks/dashboard/useDashboardPlaylistActions";

type Props = {
	playlist: Playlist;
	closeModal: () => void;
};

export default function DashbordEditPlaylistModal({ playlist, closeModal }: Props) {
	const { theme } = useThemeContext();
	const inputRef = useRef<HTMLInputElement>(null);
	const [playlistName, setPlaylistName] = useState<string>("");

	const { actions, isFetching } = useDashboardPlaylistActions();

	const isAbleToSubmit = useMemo(
		() => playlistName.trim() && playlistName !== playlist.name,
		[playlistName],
	);

	const handleEditPlaylist = async (e: FormEvent) => {
		e.preventDefault();
		if (!isAbleToSubmit) return;

		await actions({variant: 'edit-playlist', name: playlistName});
		closeModal();
	};

	useEffect(() => {
		const inputEle = inputRef.current;
		inputEle?.focus();

		setPlaylistName(playlist.name);
	}, []);

	const classes = {
		container: "w-[400px] max-w-[calc(90vw-40px)]",
		input: "rounded-md px-3 py-2 outline-none w-full bg-white/5 text-white",
	};

	return (
		<>
			<ModalHeader close={closeModal} title="Edit playlist" />
			<form
				action=""
				onSubmit={handleEditPlaylist}
				className={`${classes.container} ${isFetching ? "disable" : ""}`}
			>
				<input
					ref={inputRef}
					value={playlistName}
					onChange={(e) => setPlaylistName(e.target.value)}
					type="text"
					className={`${classes.input}`}
				/>

				<Button
					type="submit"
					variant={"primary"}
					isLoading={isFetching}
					className={`${theme.content_bg} rounded-full self-end mt-[15px] ${
						isAbleToSubmit ? "" : "disable"
					}`}
				>
					Save
				</Button>
			</form>
		</>
	);
}

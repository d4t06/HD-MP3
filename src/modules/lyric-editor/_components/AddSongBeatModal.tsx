import { ChangeEvent } from "react";
import useAddSongBeatModal from "../_hooks/useAddSongBeatModal";
import { Button, ModalHeader } from "@/components";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

type Props = {
	song: Song;
	closeModal: () => void;
};

export default function AddSongBeatModal({ song, closeModal }: Props) {
	const { theme } = useThemeContext();
	const { songFile, setSongFile, isFetching, handleSubmit } = useAddSongBeatModal({
		closeModal,
		song,
	});

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) setSongFile(e.target.files[0]);
	};

	return (
		<div className="w-[500px] max-w-[80vw] flex flex-col">
			<ModalHeader title="Song beat" close={closeModal} />
			<input
				onChange={handleInputChange}
				type="file"
				multiple
				accept="audio"
				id="song_upload"
				className="hidden"
			/>

			{(songFile || song.beat_url) && (
				<audio src={songFile ? URL.createObjectURL(songFile) : song.image_url} controls />
			)}

			<Button size={"clear"}>
				<label
					htmlFor="song_upload"
					className={`${theme.content_bg} seld-start rounded-full px-5 py-1.5 cursor-pointer mt-2`}
				>
					<ArrowUpTrayIcon className="w-5" />
				</label>
			</Button>

			<Button
				disabled={!songFile}
				onClick={handleSubmit}
				isLoading={isFetching}
				color="primary"
				className="mt-3 ml-auto font-playwriteCU"
			>
				Save
			</Button>
		</div>
	);
}

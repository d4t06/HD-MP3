import { useSongSelectContext } from "@/stores";
import { getClasses } from "@/utils/appHelpers";
// import { CheckIcon } from "@heroicons/react/20/solid";
import { StopIcon } from "@heroicons/react/24/outline";
import { useMemo } from "react";

type Props = {
	song: Song;
};

export function CheckBox({ song }: Props) {
	const { selectSong, selectedSongs, isChecked } = useSongSelectContext();

	const isSelected = useMemo(() => {
		if (!selectedSongs) return false;
		return selectedSongs.indexOf(song) != -1;
	}, [selectedSongs]);

	const handleSelect = () => {
		if (isChecked === undefined) return;
		selectSong(song);
	};

	return (
		<>
			<input readOnly checked={isSelected} className="hidden" type="checkbox" />

			<button
				onClick={handleSelect}
				className={`w-5 mr-1 flex-shrink-0 group-hover/main:block ${isChecked ? "block" : "md:hidden "}`}
			>
				{!isSelected ? (
					<StopIcon className="w-full opacity-60" />
				) : (
					<img src="./icons/check.png" className="w-4 mx-auto" />
				)}
			</button>

			<button
				className={`w-5 mr-1 hidden group-hover/main:hidden md:block ${getClasses(
					isChecked,
					"md:hidden",
				)}`}
			>
				<img src="./icons/music_note.png" className="w-4 mx-auto opacity-70" />
			</button>
		</>
	);
}

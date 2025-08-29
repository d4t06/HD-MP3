import { useSongSelectContext } from "@/stores";
import { getClasses } from "@/utils/appHelpers";
import { CheckIcon } from "@heroicons/react/20/solid";
import { MusicalNoteIcon, StopIcon } from "@heroicons/react/24/outline";
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
				className={`mr-2 md:mr-3 group-hover/main:block ${isChecked ? "block" : "md:hidden "}`}
			>
				{!isSelected ? <StopIcon className="w-5" /> : <CheckIcon className="w-5" />}
			</button>

			<button
				className={`mr-3 hidden group-hover/main:hidden md:block ${getClasses(
					isChecked,
					"md:hidden",
				)}`}
			>
				<MusicalNoteIcon  className="w-5"/>
			</button>
		</>
	);
}

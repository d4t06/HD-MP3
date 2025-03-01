import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "..";
import { useAddSongContext } from "@/stores/dashboard/AddSongContext";
import { ChangeEvent, useRef } from "react";
import { useThemeContext } from "@/stores";

export default function AddSongFile() {
	const { theme } = useThemeContext();
	const { setSongFile } = useAddSongContext();

	const inputRef = useRef<HTMLInputElement>(null);

	const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.length) setSongFile(e.target.files[0]);
	};

	return (
		<>
			<input
				ref={inputRef}
				onChange={handleInputChange}
				type="file"
				multiple
				accept="audio"
				id="song_upload"
				className="hidden"
			/>

			<div className="flex-grow flex items-center justify-center text-center">
				<label
					htmlFor="song_upload"
					className={`inline-flex py-1.5 space-x-1 rounded-full cursor-pointer px-5 ${theme.content_bg}`}
				>
					<ArrowUpTrayIcon className="w-6" />
					<span>Upload song</span>
				</label>
			</div>
		</>
	);
}

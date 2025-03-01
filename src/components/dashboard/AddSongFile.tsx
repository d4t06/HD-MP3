import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Button } from "..";
import { useAddSongContext } from "@/store/dashboard/AddSongContext";
import { ChangeEvent, useRef } from "react";
import { useTheme } from "@/store";

export default function AddSongFile() {
	const { theme } = useTheme();
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

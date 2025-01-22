import { ChangeEvent, ElementRef, useRef, useState } from "react";
import { generateId } from "@/utils/appHelpers";
import { mySetDoc, uploadFile } from "@/services/firebaseService";
import { initSongObject } from "@/utils/appHelpers";
import { useToast } from "@/store";
import { parserSong } from "@/utils/parseSong";

export default function useUploadSongDashboard() {
	// stores

	const [isFetching, setIsFetching] = useState(false);

	const inputRef = useRef<ElementRef<"input">>(null);

	// hooks
	const { setErrorToast, setSuccessToast } = useToast();

	const clearInput = () => {
		if (inputRef.current) inputRef.current.value = "";
	};

	const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const inputEle = e.target as HTMLInputElement & { files: FileList };
		const fileLists = inputEle.files;

		if (!fileLists.length) return;

		// const start = Date.now();

		try {
			setIsFetching(true);

			for (const songFile of fileLists) {
				const songData = await parserSong(songFile);

				// console.log("check song data", songData);
				if (!songData) {
					setErrorToast("Error when parser song");
					clearInput();

					return;
				}

				// init song data
				const songSchema: Song = initSongObject({
					by: "admin",
					id: generateId(songData.name) + "_admin",
					name: songData.name,
					singer: songData.singer,
					duration: Math.floor(songData.duration),
					size: Math.floor(songFile.size / 1024),
				});

				const { filePath, fileURL } = await uploadFile({
					file: songFile,
					folder: "/songs/",
					msg: ">>> api: upload song file",
					namePrefix: "admin",
				});

				// update target song
				Object.assign(songSchema, {
					song_file_path: filePath,
					song_url: fileURL,
				});

				await mySetDoc({
					collection: "songs",
					data: songSchema,
					id: songSchema.id,
					msg: ">>> api: set song doc",
				});

				// setSongs((prev) => [...prev, { ...songSchema, queue_id: nanoid(4) }]);
			}

			clearInput();
			setSuccessToast(`${fileLists.length} songs uploaded`);

			// const finish = Date.now();
		} catch (error) {
			console.log({ message: error });
			clearInput();
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { handleInputChange, inputRef, isFetching };
}

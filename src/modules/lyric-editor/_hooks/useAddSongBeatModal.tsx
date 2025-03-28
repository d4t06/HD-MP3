import { deleteFile, myUpdateDoc, uploadFile } from "@/services/firebaseService";
import { ComponentProps, useState } from "react";
import AddSongBeatModal from "../_components/AddSongBeatModal";
import { useToastContext } from "@/stores";
import { useEditLyricContext } from "../_components/EditLyricContext";

export default function useAddSongBeatModal({
	closeModal,
}: ComponentProps<typeof AddSongBeatModal>) {
	const { setErrorToast, setSuccessToast } = useToastContext();
	const { song, setSong } = useEditLyricContext();

	const [songFile, setSongFile] = useState<File>();
	const [isFetching, setIsFetching] = useState(false);

	const handleSubmit = async () => {
		try {
			if (!songFile || !song) throw new Error();

			setIsFetching(true);

			const { filePath, fileURL } = await uploadFile({
				file: songFile,
				folder: "/songs/",
				namePrefix: "beat",
			});

			const data: Partial<SongSchema> = {
				beat_url: fileURL,
				beat_file_path: filePath,
			};

			await myUpdateDoc({
				collectionName: "Songs",
				id: song.id,
				data: data,
			});

			if (song.beat_file_path)
				deleteFile({
					filePath: song.beat_file_path,
				});

			setSong(() => ({ ...song, ...data }));

			setSuccessToast("Upload song beat successful");
			closeModal();
		} catch (error) {
			console.log({ error });
			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { songFile, song, setSongFile, isFetching, handleSubmit };
}

import { ComponentProps, useEffect, useMemo, useRef, useState } from "react";
import AddAlbumModal from "..";
import { useAddAlbumContext } from "../_components/AddAlbumContext";
import { initAlbumObject } from "@/utils/factory";
import { myAddDoc, myUpdateDoc, songsCollectionRef } from "@/services/firebaseService";
import { documentId, getDoc, query, where } from "firebase/firestore";
import { implementSongQuery, optimizeAndGetHashImage } from "@/services/appService";
import { useToastContext } from "@/stores";

export default function useAddAlbum(props: ComponentProps<typeof AddAlbumModal>) {
	const {
		imageFile,
		updateAlbumData,
		setSinger,
		albumData,
		setSongs,
		album,
		singer,
		songs,
		setAlbum,
		setImageFile,
		setAlbumData,
	} = useAddAlbumContext();

	const { setSuccessToast, setErrorToast } = useToastContext();

	const [isFetching, setIsFetching] = useState(false);

	const ranEffect = useRef(false);

	const isChanged = useMemo(() => {
		if (props.variant === "add") return true;
		if (!album || !albumData || !singer) return false;

		return (
			albumData.name !== album.name ||
			singer.id !== album.singers[0].id ||
			albumData.like !== album.like ||
			!!songs.find((s) => !album.song_ids.includes(s.id))
		);
	}, [albumData, album, singer, songs]);

	const isChangeImage = !!imageFile;

	const isValidToSubmit = useMemo(() => {
		const isValid: boolean =
			!!isChanged && !!albumData && !!albumData.name && !!singer && !!songs.length;

		return props.variant === "add" ? isValid : isValid || isChangeImage;
	}, [isChangeImage, isChanged, albumData, singer, songs]);

	const submit = async () => {
		try {
			if (!albumData || !singer) return;
			setIsFetching(true);

			if (imageFile) {
				const imageData = await optimizeAndGetHashImage({ imageFile });
				Object.assign(albumData, imageData);
			}

			albumData.singers = [singer];
			albumData.singer_map = { [singer.id]: true };
			albumData.song_ids = songs.map((s) => s.id);

			switch (props.variant) {
				case "add": {
					const docRef = await myAddDoc({
						collectionName: "Playlists",
						data: albumData,
					});

					const newDocRef = await getDoc(docRef);

					const newAlbum: Playlist = {
						...(newDocRef.data() as PlaylistSchema),
						id: newDocRef.id,
					};

					props.callback(newAlbum);
					setSuccessToast(`Album created`);

					break;
				}
				case "edit": {
					if (!album) return;

					await myUpdateDoc({
						collectionName: "Playlists",
						data: albumData,
						id: album.id,
					});

					setAlbum({ ...album, ...albumData });
					setSuccessToast(`Album edited`);

					break;
				}
			}
		} catch (error) {
			console.log(error);
			setErrorToast();
		} finally {
			setIsFetching(false);
			setImageFile(undefined);
		}
	};

	const initAlbumData = async () => {
		switch (props.variant) {
			case "add":
				setAlbumData(
					initAlbumObject({
						owner_email: props.user.email,
						distributor: props.user.email,
					}),
				);

				setSinger(props.singer);

				break;

			case "edit":
				const { id, song_ids, singers, ...rest } = props.album;

				if (song_ids) {
					const queryGetSongs = query(
						songsCollectionRef,
						where(documentId(), "in", song_ids),
					);

					const songs = await implementSongQuery(queryGetSongs);
					setSongs(songs);
				}

				setAlbum(props.album);

				setSinger(singers[0]);

				setAlbumData(initAlbumObject({ ...rest, song_ids, singers }));
				break;
		}
	};

	useEffect(() => {
		if (!ranEffect.current) {
			ranEffect.current = true;

			initAlbumData();
		}
	}, []);

	useEffect(() => {
		if (!imageFile) return;

		updateAlbumData({ image_url: URL.createObjectURL(imageFile) });
	}, [imageFile]);

	return { submit, isFetching, isValidToSubmit };
}

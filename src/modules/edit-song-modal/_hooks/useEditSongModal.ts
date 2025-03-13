import { ModalRef } from "@/components/Modal";
import { optimizeAndGetHashImage } from "@/services/appService";
import { deleteFile, myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { RefObject, useMemo, useState } from "react";

type Props = {
  song: Song;
  modalRef: RefObject<ModalRef>;
};

export default function useEditSongModal({ song, modalRef }: Props) {
  const { user } = useAuthContext();
  const { updateSong } = useSongContext();

  const [songData, setSongData] = useState({
    name: song.name,
    singer: song.singers[0].name,
    image_url: song.image_url,
  });

  const [isFetching, setIsFetching] = useState(false);
  const [imageFile, setImageFile] = useState<File>();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const isChanged = useMemo(
    () => song.name !== songData.name || song.singers[0].name !== songData.singer,
    [songData]
  );

  const isValidToSubmit =
    (!!songData.name && !!songData.singer && isChanged) || imageFile;

  const handleInput = (field: keyof typeof songData, value: string) => {
    setSongData({ ...songData, [field]: value });
  };

  const handleSubmit = async () => {
    try {
      if (!user || !isValidToSubmit) return;

      setIsFetching(true);
      modalRef.current?.setModalPersist(true);

      const { id, ...newSong } = song;

      if (isChanged) {
        if (!songData.name || !songData.singer) return;

        newSong.name = songData.name;
        newSong.singers = [{ ...newSong.singers[0], name: songData.singer }];
      }

      if (imageFile) {
        const imageData = await optimizeAndGetHashImage(imageFile);

        Object.assign(newSong, imageData);

        if (song.image_file_path) {
          await deleteFile({ filePath: song.image_file_path });
        }
      }

      // >>> api
      await myUpdateDoc({
        collectionName: "Songs",
        data: newSong,
        id: song.id,
      });

      updateSong({ id: song.id, song: newSong });
      // >>> finish
      setSuccessToast(`Song edited`);
      modalRef.current?.close();
    } catch (error) {
      console.log({ message: error });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return {
    isFetching,
    isChanged,
    songData,
    isValidToSubmit,
    handleSubmit,
    imageFile,
    setImageFile,
    handleInput,
  };
}

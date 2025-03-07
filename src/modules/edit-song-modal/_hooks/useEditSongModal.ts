import { ModalRef } from "@/components/Modal";
import {
  deleteFile,
  myUpdateDoc,
  uploadBlob,
  uploadFile,
} from "@/services/firebaseService";
import { getBlurHashEncode, optimizeImage } from "@/services/imageService";
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
  });

  const [isFetching, setIsFetching] = useState(false);

  const [isImpactOnImage, setIsImpactOnImage] = useState(false);
  const [stockImageURL, setStockImageURL] = useState(song.image_url);
  const [imageURLFromLocal, setImageURLFromLocal] = useState("");
  const [imageFileFromLocal, setImageFileFromLocal] = useState<File>();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const isChanged = useMemo(
    () => song.name !== songData.name || song.singers[0].name !== songData.singer,
    [songData]
  );

  const isValidToSubmit =
    (!!songData.name && !!songData.singer && isChanged) || isImpactOnImage;

  const handleInput = (field: keyof typeof songData, value: string) => {
    setSongData({ ...songData, [field]: value });
  };

  const handleSubmit = async () => {
    if (!user) return;

    if (!song.id) {
      setErrorToast("Edit song wrong song id");
      return;
    }

    try {
      setIsFetching(true);
      modalRef.current?.setModalPersist(true);

      const { id, ...newSong } = song;

      if (isChanged) {
        if (!songData.name || !songData.singer) return;

        newSong.name = songData.name;
        newSong.singers = [{ ...newSong.singers[0], name: songData.singer }];

        if (imageFileFromLocal && isImpactOnImage) {
          const { filePath, fileURL } = await uploadFile({
            file: imageFileFromLocal,
            folder: "/images/",
            namePrefix: user.email,
          });
          newSong.image_file_path = filePath;
          newSong.image_url = fileURL;

          // if user remove image
        } else if (isImpactOnImage) {
          newSong.image_file_path = "";
        }
      }

      // if user upload, change, unset image
      if (isImpactOnImage) {
        console.log("change image");
        setIsFetching(true);

        // >>> handle delete song file
        // when user upload new image
        if (song.image_file_path) {
          newSong.image_file_path = "";
          newSong.image_url = "";

          await deleteFile({
            filePath: song.image_file_path,
            msg: ">>> api: delete song's image file",
          });
        }

        // when user remove current image url and no upload image from local
        if (!stockImageURL && !imageFileFromLocal) {
          console.log("remove current image url");

          newSong.image_file_path = "";
          newSong.image_url = "";
        }

        // >>> handle add new song file if exist
        // handle upload image upload from local
        if (imageFileFromLocal) {
          console.log("upload new file");

          const imageBlob = await optimizeImage(imageFileFromLocal);
          if (imageBlob == undefined) return;

          const uploadProcess = uploadBlob({
            blob: imageBlob,
            folder: "/images/",
          });

          const { encode } = await getBlurHashEncode(imageBlob);
          if (encode) {
            newSong.blurhash_encode = encode;
            console.log("check encode", encode);
          }

          const { filePath, fileURL } = await uploadProcess;
          newSong.image_file_path = filePath;
          newSong.image_url = fileURL;
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
    setIsImpactOnImage,
    setStockImageURL,
    setImageURLFromLocal,
    setImageFileFromLocal,
    isImpactOnImage,
    stockImageURL,
    imageURLFromLocal,
    imageFileFromLocal,
    handleInput,
  };
}

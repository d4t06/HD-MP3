import { ModalRef } from "@/components/Modal";
import { deleteFile, mySetDoc, uploadBlob, uploadFile } from "@/services/firebaseService";
import { getBlurHashEncode, optimizeImage } from "@/services/imageService";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { sleep } from "@/utils/appHelpers";
import { RefObject, useEffect, useState } from "react";

type Props = {
  song: Song;
  inputFields: {
    name: string;
    singer: string;
    image_url: string;
  };
  modalRef: RefObject<ModalRef>;
};

const URL_REGEX = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function useEditForm({ song, inputFields, modalRef }: Props) {
  const { user } = useAuthContext();
  const { updateSong } = useSongContext();

  const [validName, setValidName] = useState(!!song.name);
  const [validSinger, setValidSinger] = useState(!!song.singer);
  const [validURL, setValidURL] = useState(false);
  const [isAbleToSubmit, setIsAbleToSubmit] = useState(false);
  const [isChangeInEdit, setIsChangeInEdit] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const [isImpactOnImage, setIsImpactOnImage] = useState(false);
  const [stockImageURL, setStockImageURL] = useState(song.image_url);
  const [imageURLFromLocal, setImageURLFromLocal] = useState("");
  const [imageFileFromLocal, setImageFileFromLocal] = useState<File>();

  const { setErrorToast, setSuccessToast } = useToastContext();

  const handleSubmit = async () => {
    if (!user) return;

    if (!song.id) {
      setErrorToast("Edit song wrong song id");
      return;
    }

    try {
      setIsFetching(true);
      modalRef.current?.setModalPersist(true);

      let newSongData: Partial<Song> = {
        name: song.name,
        singer: song.singer,
        image_url: song.image_url,
        image_file_path: song.image_file_path,
        blurhash_encode: song.blurhash_encode,
      };

      if (isChangeInEdit) {
        console.log("is change in edit");

        // check valid input
        if (!inputFields.name || !inputFields.singer) {
          console.log("input invalid");
          setErrorToast("");
          return;
        }

        const songImageUrl =
          !!inputFields.image_url && validURL ? inputFields.image_url : song.image_url;

        await sleep(1000);

        Object.assign(newSongData, {
          name: inputFields.name,
          singer: inputFields.singer,
          image_url: songImageUrl,
        } as Partial<Song>);

        // check valid
        if (
          newSongData.name !== inputFields.name ||
          newSongData.singer !== inputFields.singer
        ) {
          console.log("input invalid");
          setErrorToast();
          return;
        }

        // user upload song from local
        if (imageFileFromLocal && isImpactOnImage) {
          const { filePath, fileURL } = await uploadFile({
            file: imageFileFromLocal,
            folder: "/images/",
            namePrefix: user.email,
          });
          newSongData.image_file_path = filePath;
          newSongData.image_url = fileURL;

          // if user remove image
        } else if (isImpactOnImage) {
          newSongData.image_file_path = "";
        }
      }

      // if user upload, change, unset image
      if (isImpactOnImage) {
        setIsFetching(true);

        console.log("isImpactOnImage");

        // >>> handle delete song file
        // when user upload new image
        if (song.image_file_path) {
          newSongData.image_file_path = "";
          newSongData.image_url = "";

          await deleteFile({
            filePath: song.image_file_path,
            msg: ">>> api: delete song's image file",
          });
        }

        // when user remove current image url and no upload image from local
        if (!stockImageURL && !imageFileFromLocal) {
          console.log("remove current image url");

          newSongData.image_file_path = "";
          newSongData.image_url = "";
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
            songId: song.id,
          });

          const { encode } = await getBlurHashEncode(imageBlob);
          if (encode) {
            newSongData.blurhash_encode = encode;
            console.log("check encode", encode);
          }

          const { filePath, fileURL } = await uploadProcess;
          newSongData.image_file_path = filePath;
          newSongData.image_url = fileURL;
        }
      }

      // >>> api
      await mySetDoc({
        collection: "songs",
        data: newSongData,
        id: song.id,
        msg: ">>> api: update song doc",
      });

      updateSong({ id: song.id, song: newSongData });
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

  // validate song name
  useEffect(() => {
    if (!inputFields.name) {
      setValidName(false);
    } else {
      setValidName(true);
    }
  }, [inputFields.name]);

  // validate song name
  useEffect(() => {
    if (!inputFields.singer) {
      setValidSinger(false);
    } else {
      setValidSinger(true);
    }
  }, [inputFields.singer]);

  useEffect(() => {
    if (!inputFields.image_url) {
      setValidURL(true);
      return;
    }
    const test1 = URL_REGEX.test(inputFields.image_url);
    setValidURL(test1);
  }, [inputFields.image_url]);

  useEffect(() => {
    if (
      inputFields.name !== song.name ||
      inputFields.singer !== song.singer ||
      inputFields.image_url
    ) {
      setIsChangeInEdit(true);
    }
  }, [inputFields, imageURLFromLocal]);

  useEffect(() => {
    setIsAbleToSubmit(validName && validSinger && validURL && isChangeInEdit);
  }, [validName, validSinger, validURL, isChangeInEdit]);

  return {
    isFetching,
    validName,
    validSinger,
    validURL,
    isAbleToSubmit,
    isChangeInEdit,
    setValidURL,
    handleSubmit,
    setIsImpactOnImage,
    setStockImageURL,
    setImageURLFromLocal,
    setImageFileFromLocal,
    isImpactOnImage,
    stockImageURL,
    imageURLFromLocal,
    imageFileFromLocal,
  };
}

import { deleteFile, mySetDoc, uploadBlob, uploadFile } from "@/services/firebaseService";
import { getBlurHashEncode, optimizeImage } from "@/services/imageService";
import { useAuthStore, useSongsStore, useToast } from "@/store";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  song: Song;
  inputFields: {
    name: string;
    singer: string;
    image_url: string;
  };
  closeModal: () => void;
};

const URL_REGEX = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function useEditForm({ song, inputFields, closeModal }: Props) {
  const dispatch = useDispatch();
  const { user } = useAuthStore();
  const { updateUserSong } = useSongsStore();
  const { currentSong } = useSelector(selectCurrentSong);

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

  const { setErrorToast, setSuccessToast } = useToast();

  const handleSubmit = async () => {
    if (!user) return;

    if (!song.id) {
      setErrorToast("Edit song wrong song id");
      return;
    }

    try {
      // const newTargetSongs: Song[] = [...targetSongs];
      let newSong: Song = { ...song };

      if (isChangeInEdit) {
        console.log("is change in edit");

        // check valid input
        if (!inputFields.name || !inputFields.singer) {
          console.log("input invalid");
          setErrorToast("");
          return;
        }

        const songImageUrl =
          !!inputFields.image_url && validURL ? inputFields.image_url : newSong.image_url;

        setIsFetching(true);
        newSong = {
          ...newSong,
          name: inputFields.name,
          singer: inputFields.singer,
          image_url: songImageUrl,
        };

        // check valid
        if (newSong.name !== inputFields.name || newSong.singer !== inputFields.singer) {
          console.log("input invalid");
          setErrorToast();
          return;
        }

        // user upload song from local
        if (imageFileFromLocal && isImpactOnImage) {
          const { filePath, fileURL } = await uploadFile({
            file: imageFileFromLocal,
            folder: "/images/",
            email: user.email,
          });
          newSong.image_file_path = filePath;
          newSong.image_url = fileURL;

          // if user remove image
        } else if (isImpactOnImage) {
          newSong.image_file_path = "";
        }

        // if (!isImpactOnImage) {
        //    updateUserSong(newSong);
        // }
      }

      // if user upload, change, unset image
      if (isImpactOnImage) {
        setIsFetching(true);

        console.log("isImpactOnImage");

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
            songId: newSong.id,
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
      await mySetDoc({
        collection: "songs",
        data: newSong,
        id: newSong.id,
        msg: ">>> api: update song doc",
      });

      updateUserSong(newSong);
      // dispatch(updateSongInQueue({ song: newSong }));

      if (currentSong?.id === newSong.id) {
        dispatch(
          setSong({
            ...newSong,
            currentIndex: currentSong.currentIndex,
            song_in: currentSong.song_in,
          })
        );
      }
      // }

      // >>> finish
      setSuccessToast(`Song edited`);
      closeModal();
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

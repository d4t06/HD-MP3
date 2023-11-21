import {
  ChangeEvent,
  MouseEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Song, ThemeType } from "../../types";
import {
  deleteFile,
  mySetDoc,
  uploadBlob,
  uploadFile,
} from "../../utils/firebaseHelpers";
import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Image, Button } from "..";
import {
  useToast,
  useAuthStore,
  selectAllSongStore,
  setSong,
  useSongsStore,
  useActuallySongs,
} from "../../store";
import { useEditForm } from "../../hooks";
import {
  getBlurhashEncode,
  optimizeImage,
  updateSongsListValue,
} from "../../utils/appHelpers";
import { useDispatch, useSelector } from "react-redux";

type Props = {
  song: Song;
  admin?: boolean;
  setIsOpenModal: (isOpenModal: boolean) => void;
  theme: ThemeType & { alpha: string };
};

export default function SongItemEditForm({ song, setIsOpenModal, theme, admin }: Props) {
  // use store
  const dispatch = useDispatch();
  const { userInfo } = useAuthStore();
  const { setErrorToast, setSuccessToast } = useToast();
  const { song: songInStore } = useSelector(selectAllSongStore);
  const { userSongs, adminSongs, setUserSongs, setAdminSongs } = useSongsStore();
  const { actuallySongs, setActuallySongs } = useActuallySongs();

  // state
  const [loading, setLoading] = useState(false);
  const [isImpactOnImage, setIsImpactOnImage] = useState(false);

  const [stockImageURL, setStockImageURL] = useState(song.image_url);
  const [localImageURL, setLocalImageURL] = useState("");
  const [imageFile, setImageFile] = useState<File>();
  const [inputFields, setInputFields] = useState({
    name: song.name,
    singer: song.singer,
    image_url: "",
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  const targetSongs = useMemo(
    () => (admin ? adminSongs : userSongs),
    [admin, admin, userSongs]
  );

  // use hooks
  const {
    isAbleToSubmit,
    validName,
    validSinger,
    validURL,
    isChangeInEdit,
    setValidURL,
  } = useEditForm({
    data: song,
    inputFields,
    localImageURL,
  });

  // priority order
  // - upload image (now => before) (local image url or image file path)
  // - image from url
  const imageToDisplay = useMemo(() => {
    if (localImageURL) return localImageURL;
    else if (stockImageURL) return stockImageURL;
    else if (validURL) return inputFields.image_url;
  }, [inputFields, localImageURL, stockImageURL, song, validURL]);

  const isShowRemoveImageButton = useMemo(
    () => !!localImageURL || !!stockImageURL,
    [localImageURL, stockImageURL]
  );

  const handleInput = (field: keyof typeof inputFields, value: string) => {
    setInputFields({ ...inputFields, [field]: value });
  };

  //   trigger only have image from local
  const handleUnsetImage = useCallback(() => {
    // main case 1: song has image before
    // case 1: user remove current image
    if (song.image_file_path && !localImageURL) {
      setStockImageURL("");

      // case 2: after upload, user remove image
    } else if (localImageURL) {
      setLocalImageURL("");
      setImageFile(undefined);
    } else {
      // main case 2: user never upload image before
      setStockImageURL("");
    }

    setIsImpactOnImage(true);

    const inputEle = inputFileRef.current as HTMLInputElement;
    if (inputEle) {
      inputEle.value = "";
    }
  }, [localImageURL, song.image_file_path]);

  const uploadImageFromLocal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };

    const imageFile = target.files[0];
    setLocalImageURL(URL.createObjectURL(imageFile));

    setIsImpactOnImage(true);
    setImageFile(imageFile);
  }, []);

  const closeModal = () => {
    setLoading(false);
    setIsOpenModal(false);
  };

  const handleCloseEditForm: MouseEventHandler = (e) => {
    e.stopPropagation();
    closeModal();
    setIsOpenModal(false);
  };

  const handleEditSong = async () => {
    if (!song.id) {
      setErrorToast({ message: "Edit song wrong data id" });
      return;
    }

    try {
      const newTargetSongs: Song[] = [...targetSongs];
      let newSong: Song = { ...song };

      if (isChangeInEdit) {
        console.log("is change in edit");

        // check valid input
        if (!inputFields.name || !inputFields.singer) {
          console.log("input invalid");
          setErrorToast({});
          return;
        }

        const songImageUrl =
          !!inputFields.image_url && validURL ? inputFields.image_url : newSong.image_url;

        setLoading(true);
        newSong = {
          ...newSong,
          name: inputFields.name,
          singer: inputFields.singer,
          image_url: songImageUrl,
        };

        // check valid
        if (newSong.name !== inputFields.name || newSong.singer !== inputFields.singer) {
          console.log("input invalid");
          setErrorToast({});
          return;
        }

        // user upload song from local
        if (imageFile && isImpactOnImage) {
          const { filePath, fileURL } = await uploadFile({
            file: imageFile,
            folder: "/images/",
            email: userInfo.email,
          });
          newSong.image_file_path = filePath;
          newSong.image_url = fileURL;

          // if user remove image
        } else if (isImpactOnImage) {
          newSong.image_file_path = "";
        }

        if (!isImpactOnImage) {
          // update user songs
          const index = updateSongsListValue(newSong, newTargetSongs);
          if (index == undefined) {
            setErrorToast({ message: "New user song Error" });
            return;
          }
        }
      }

      // if user upload, change, unset image
      if (isImpactOnImage) {
        setLoading(true);

        console.log("isImpactOnImage");
        // delete old image in case unset image and change image
        if (!imageFile || (imageFile && song.image_file_path)) {
          newSong.image_file_path = "";
          newSong.image_url = "";
          // >>> api
          await deleteFile({
            filePath: song.image_file_path,
            msg: ">>> api: delete song's image file",
          });
        }

        if (imageFile) {
          const imageBlob = await optimizeImage(imageFile);
          if (imageBlob == undefined) return;

          const uploadProcess = uploadBlob({
            blob: imageBlob,
            folder: "/images/",
            songId: newSong.id,
          });

          const { encode } = await getBlurhashEncode(imageBlob);
          if (encode) {
            newSong.blurhash_encode = encode;
            console.log("check encode", encode);
          }

          const { filePath, fileURL } = await uploadProcess;
          newSong.image_file_path = filePath;
          newSong.image_url = fileURL;
        }

        const index = updateSongsListValue(newSong, newTargetSongs);
        if (index == undefined) {
          setErrorToast({ message: "New user song Error" });
          return;
        }
      }

      // >>> api
      await mySetDoc({
        collection: "songs",
        data: newSong,
        id: newSong.id,
        msg: ">>> api: update song doc",
      });

      // >>> local
      // case admin
      if (admin) setAdminSongs(newTargetSongs);
      // case user
      else {
        setUserSongs(newTargetSongs);

        const newSongQueue = [...actuallySongs];
        updateSongsListValue(newSong, newSongQueue);

        setActuallySongs(newSongQueue);
        console.log('setActuallySongs');
        

        if (songInStore.id === newSong.id) {
          dispatch(
            setSong({
              ...newSong,
              currentIndex: songInStore.currentIndex,
              song_in: songInStore.song_in,
            })
          );
        }
      }

      // >>> finish
      setSuccessToast({ message: `${newSong.name} edited` });
      closeModal();
    } catch (error: any) {
      console.log(error);

      if (error.response.data) console.log("[error]: ", error.response.data);
      else console.log("[error]: Server error");

      setErrorToast({});
    } finally {
      setLoading(false);
    }
  };

  // define style
  const classes = {
    textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
    input: `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} text-[14px] font-[500]`,
  };

  return (
    <div
      className={`w-[500px] max-w-[calc(90vw-40px)] h-[auto] ${
        loading ? "opacity-60 pointer-events-none" : ""
      }`}
    >
      <input
        ref={inputFileRef}
        id="editImageInput"
        type="file"
        onChange={uploadImageFromLocal}
        className="hidden"
      />
      <h1 className="text-[20px] font-semibold">Edit</h1>
      <div className="flex gap-[20px] mt-[10px] max-[800px]:flex-col">
        <div className="w-[130px] max-[800px]:flex max-[800px]:gap-[20px]">
          <div className="w-[130px] h-[130px] flex-shrink-0 rounded-[5px] overflow-hidden">
            <Image
              classNames="object-cover object-center w-full h-full"
              onError={() => setValidURL(false)}
              src={imageToDisplay}
              blurHashEncode={song.blurhash_encode}
            />
          </div>

          <div className="md:mt-[10px]">
            <div className="flex gap-[10px]">
              <label
                htmlFor="editImageInput"
                className={`inline-block cursor-pointer hover:brightness-90 px-[20px] py-[5px] bg-${theme.alpha} rounded-full text-[14px]`}
              >
                <ArrowUpTrayIcon className="w-[15px]" />
              </label>
              {isShowRemoveImageButton && (
                <Button
                  onClick={() => handleUnsetImage()}
                  className={`inline-block hover:brightness-90 px-[20px] py-[5px] ${theme.content_bg} rounded-full text-[14px]`}
                >
                  <XMarkIcon className="w-[15px]" />
                </Button>
              )}
            </div>
            <p className={`text-[12px] ${classes.textColor} mt-[10px]`}>
              * Image from URL will not be apply until you remove current image
            </p>
          </div>
        </div>
        <div className="flex flex-col flex-grow gap-[10px]">
          <div className="flex flex-col gap-[5px]">
            <p className="text-[14px] inline-flex">
              Name:
              {validName ? (
                <CheckIcon className="w-[20px] text-emerald-500 ml-[10px]" />
              ) : (
                <XMarkIcon className="w-[20px] text-red-500 ml-[10px]" />
              )}
            </p>
            <input
              className={`${classes.input} ${classes.textColor}`}
              value={inputFields.name}
              type="text"
              onChange={(e) => handleInput("name", e.target.value)}
              placeholder={song.name}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="inline-flex text-[14px]">
              Singer:
              {validSinger ? (
                <CheckIcon className="w-[20px] text-emerald-500 ml-[10px]" />
              ) : (
                <XMarkIcon className="w-[20px] text-red-500 ml-[10px]" />
              )}
            </p>
            <input
              className={classes.input}
              value={inputFields.singer}
              onChange={(e) => handleInput("singer", e.target.value)}
              type="text"
              placeholder={song.singer}
            />
          </div>
          <div className="flex flex-col gap-[5px]">
            <p className="inline-flex text-[14px]">
              Image URL:
              {inputFields.image_url && (
                <>
                  {validURL ? (
                    <CheckIcon className="w-[20px] text-emerald-500 ml-[10px]" />
                  ) : (
                    <XMarkIcon className="w-[20px] text-red-500 ml-[10px]" />
                  )}
                </>
              )}
            </p>
            <input
              className={classes.input}
              value={inputFields.image_url}
              onChange={(e) => handleInput("image_url", e.target.value)}
              type="text"
            />
          </div>

          <div className="flex gap-[10px] mt-[10px]">
            <Button
              onClick={handleCloseEditForm}
              className={`bg-${theme.alpha} rounded-full text-[14px]`}
              variant={"primary"}
            >
              <XMarkIcon className="w-[20px]" />
            </Button>

            <Button
              isLoading={loading}
              onClick={() => handleEditSong()}
              className={`${theme.content_bg} rounded-full text-[14px] ${
                !isAbleToSubmit
                  ? !isImpactOnImage && "pointer-events-none opacity-60"
                  : ""
              }`}
              variant={"primary"}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

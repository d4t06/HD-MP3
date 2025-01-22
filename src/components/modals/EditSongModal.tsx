import {
  ChangeEvent,
  MouseEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Image, Button } from "..";
import { useTheme } from "@/store";
import { useEditForm } from "@/hooks";
import ModalHeader from "./ModalHeader";
import { getDisable } from "@/utils/appHelpers";
import { ModalRef } from "../Modal";
import AddSingerButton from "./_components/AddSingerButton";

type Props = {
  song: Song;
  admin?: boolean;
  modalRef: RefObject<ModalRef>;
};

export default function EditSongModal({ song, admin, modalRef }: Props) {
  const { theme } = useTheme();

  const [inputFields, setInputFields] = useState({
    name: song.name,
    singer: song.singer,
    image_url: "",
  });

  const inputFileRef = useRef<HTMLInputElement>(null);

  // use hooks
  const {
    isAbleToSubmit,
    validName,
    validSinger,
    validURL,
    imageURLFromLocal,
    isImpactOnImage,
    setImageFileFromLocal,
    setImageURLFromLocal,
    setStockImageURL,
    setIsImpactOnImage,
    stockImageURL,
    setValidURL,
    isFetching,
    handleSubmit,
  } = useEditForm({
    song,
    inputFields,
    modalRef,
  });

  // priority order
  // - upload image (now => before) (local image url or image file path)
  // - image from url
  const imageToDisplay = useMemo(() => {
    if (imageURLFromLocal) return imageURLFromLocal;
    else if (stockImageURL) return stockImageURL;
    else if (validURL) return inputFields.image_url;
  }, [inputFields, imageURLFromLocal, stockImageURL, song, validURL]);

  const isShowRemoveImageButton = useMemo(
    () => !!imageURLFromLocal || !!stockImageURL,
    [imageURLFromLocal, stockImageURL],
  );

  const handleInput = (field: keyof typeof inputFields, value: string) => {
    setInputFields({ ...inputFields, [field]: value });
  };

  //   trigger only have image from local
  const handleUnsetImage = useCallback(() => {
    // main case 1: song has image before
    // case 1: user remove current image
    if (song.image_file_path && !imageURLFromLocal) {
      setStockImageURL("");

      // case 2: after upload, user remove image
    } else if (imageURLFromLocal) {
      setImageURLFromLocal("");
      setImageFileFromLocal(undefined);
    } else {
      // main case 2: user never upload image before
      setStockImageURL("");
    }

    setIsImpactOnImage(true);

    const inputEle = inputFileRef.current as HTMLInputElement;
    if (inputEle) {
      inputEle.value = "";
    }
  }, [imageURLFromLocal, song.image_file_path]);

  const uploadImageFromLocal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement & { files: FileList };

    const imageFileFromLocal = target.files[0];
    setImageURLFromLocal(URL.createObjectURL(imageFileFromLocal));

    setIsImpactOnImage(true);
    setImageFileFromLocal(imageFileFromLocal);
  }, []);

  const handleCloseEditForm: MouseEventHandler = (e) => {
    e.stopPropagation();
    modalRef.current?.close();
  };

  const getIcon = (v: boolean) => {
    return v ? (
      <CheckIcon className="w-6 text-emerald-500 ml-2" />
    ) : (
      <XMarkIcon className="w-6 text-red-500 ml-2" />
    );
  };

  // define style
  const classes = {
    input: `px-2 py-1 outline-none rounded-[4px] bg-[#fff]/5 font-[500]`,
    label: "text-lg inline-flex",
  };

  const renderUsersongInupt = () => {
    return (
      <>
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="name" className={classes.label}>
            Name
            {getIcon(validName)}
          </label>
          <input
            className={`${classes.input} `}
            value={inputFields.name}
            type="text"
            id="name"
            onChange={(e) => handleInput("name", e.target.value)}
            placeholder={song.name}
          />
        </div>
        {!admin && (
          <div className="flex flex-col gap-[5px]">
            <label htmlFor="singer" className={classes.label}>
              Singer
              {getIcon(validSinger)}
            </label>
            <input
              className={classes.input}
              value={inputFields.singer}
              onChange={(e) => handleInput("singer", e.target.value)}
              type="text"
              id="singer"
              placeholder={song.singer}
            />
          </div>
        )}
        <div className="flex flex-col gap-[5px]">
          <label htmlFor="image-url" className={classes.label}>
            Image URL
            {inputFields.image_url && <>{getIcon(validURL)}</>}
          </label>
          <input
            id="image-url"
            className={classes.input}
            value={inputFields.image_url}
            onChange={(e) => handleInput("image_url", e.target.value)}
            type="text"
          />
        </div>
      </>
    );
  };

  const renderDashboardSongInput = () => {
    return (
      <>
        {renderUsersongInupt()}
        <div className="flex flex-col gap-[5px]">
          <div className={`${classes.label} items-center`}>
            <span>Singer</span>

            <AddSingerButton setSinger={s => handleInput('singer', s)} />
          </div>
          <div className={`bg-white/5 rounded-md p-2`}>
            {inputFields.singer}
          </div>
        </div>

        <div className="flex flex-col gap-[5px]">
          <label htmlFor="image-url" className={classes.label}>
            Genre
          </label>

          <select className={classes.input}>
            <option value="">Other</option>
          </select>
        </div>
      </>
    );
  };

  return (
    <div
      className={`${getDisable(
        isFetching,
      )} w-[600px] max-h-[80vh] max-w-[90vw] text-white flex flex-col`}
    >
      <input
        ref={inputFileRef}
        id="editImageInput"
        type="file"
        accept="image/*"
        onChange={uploadImageFromLocal}
        className="hidden"
      />

      <ModalHeader title="Edit song" close={() => modalRef.current?.close()} />

      <div className="flex flex-col flex-grow overflow-auto md:overflow-hidden md:flex-row mt-5">
        <div className="w-full md:w-[30%]">
          <div className="w-[70%] mx-auto md:w-full">
            <div className="pt-[100%] relative">
              <div className="absolute inset-0">
                <Image
                  className="object-cover rounded-md object-center w-full h-full"
                  onError={() => setValidURL(false)}
                  src={imageToDisplay}
                  blurHashEncode={song.blurhash_encode}
                />
              </div>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex space-x-2">
              <label
                htmlFor="editImageInput"
                className={`inline-block cursor-pointer hover:brightness-90 px-[20px] py-[5px] bg-${theme.alpha} rounded-full text-[14px]`}
              >
                <ArrowUpTrayIcon className="w-5" />
              </label>
              {isShowRemoveImageButton && (
                <Button
                  onClick={() => handleUnsetImage()}
                  className={`inline-block hover:brightness-90 px-[20px] py-[5px] ${theme.content_bg} rounded-full text-[14px]`}
                >
                  <XMarkIcon className="w-5" />
                </Button>
              )}
            </div>
            <p className={`text-sm  mt-[10px]`}>
              * Image from URL will not be apply until you remove current image
            </p>
          </div>
        </div>

        <div className="pt-5 md:pt-0 md:pl-5 flex flex-col md:flex-grow space-y-3">
          {admin ? renderDashboardSongInput() : renderUsersongInupt()}
        </div>
      </div>
      <div className="flex mt-5 space-x-2 justify-end">
        <Button
          onClick={handleCloseEditForm}
          className={`bg-${theme.alpha} rounded-full`}
          variant={"primary"}
        >
          Close
        </Button>

        <Button
          isLoading={isFetching}
          onClick={handleSubmit}
          className={`${theme.content_bg} rounded-full ${
            !isAbleToSubmit ? !isImpactOnImage && "disable" : ""
          }`}
          variant={"primary"}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

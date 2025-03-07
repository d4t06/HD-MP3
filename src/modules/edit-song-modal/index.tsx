import {
  ChangeEvent,
  MouseEventHandler,
  RefObject,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Image, Button, ModalHeader, ModalRef, Empty } from "@/components";
import { useThemeContext } from "@/stores";
import { getDisable } from "@/utils/appHelpers";
import useEditSongModal from "./_hooks/useEditSongModal";

type Props = {
  song: Song;
  modalRef: RefObject<ModalRef>;
};

export default function EditSongModal({ song, modalRef }: Props) {
  const { theme } = useThemeContext();
  const inputFileRef = useRef<HTMLInputElement>(null);

  // use hooks
  const {
    isValidToSubmit,
    imageURLFromLocal,
    songData,
    setImageFileFromLocal,
    setImageURLFromLocal,
    setStockImageURL,
    setIsImpactOnImage,
    stockImageURL,
    isFetching,
    handleSubmit,
    handleInput,
  } = useEditSongModal({
    song,
    modalRef,
  });

  // priority order
  // - upload image (now => before) (local image url or image file path)
  // - image from url
  const imageToDisplay = useMemo(() => {
    if (imageURLFromLocal) return imageURLFromLocal;
    else if (stockImageURL) return stockImageURL;
  }, [imageURLFromLocal, stockImageURL, song]);

  const isShowRemoveImageButton = useMemo(
    () => !!imageURLFromLocal || !!stockImageURL,
    [imageURLFromLocal, stockImageURL]
  );

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

  // define style
  const classes = {
    input: `px-2 py-1 outline-none rounded-[4px] bg-[#fff]/5 font-[500]`,
    label: "text-lg inline-flex",
  };

  return (
    <div
      className={`${getDisable(
        isFetching
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
            <Empty>
              <Image
                className="object-cover rounded-md object-center"
                src={imageToDisplay}
                blurHashEncode={song.blurhash_encode}
              />
            </Empty>
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

        <div className="pt-5 md:pt-0 md:pl-5 md:flex-grow space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="name" className={classes.label}>
              Name
            </label>
            <input
              className={`${classes.input} `}
              value={songData.name}
              type="text"
              id="name"
              onChange={(e) => handleInput("name", e.target.value)}
              placeholder={song.name}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="singer" className={classes.label}>
              Singer
            </label>
            <input
              className={classes.input}
              value={songData.singer}
              onChange={(e) => handleInput("singer", e.target.value)}
              type="text"
              id="singer"
              placeholder={song.singers[0].name}
            />
          </div>
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
          disabled={!isValidToSubmit}
          className={`${theme.content_bg} rounded-full`}
          variant={"primary"}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

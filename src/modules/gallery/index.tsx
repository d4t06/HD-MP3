import { Image, Loading, ModalContentWrapper } from "@/components";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useGalleryContext } from "@/stores/dashboard/GalleryContext";
import ChooseBtn from "./_components/ChooseBtn";
import { Button } from "@/pages/dashboard/_components";
import useGalleryAction from "./_hooks/useGalleryAction";
import GalleryItem from "./_components/ImageItem";
import { formatSize } from "@/utils/appHelpers";

type Props = {
  setImageUrl: (images: ImageType[]) => void;
  closeModal?: () => void;
  multiple?: boolean;
};

export default function Gallery({ setImageUrl, closeModal, multiple }: Props) {
  const {
    images,
    page,
    isLast,
    setPage,
    isFetching,
    uploadingImages,
    shoudFetchingImage,
  } = useGalleryContext();

  const [chooseList, setChooseList] = useState<ImageType[]>([]);
  const [activeImage, setActiveImage] = useState<ImageType>();

  const { getImages } = useGalleryAction();

  const handleSelect = (image: ImageType) => {
    const newChoseList = [...chooseList];
    const index = newChoseList.findIndex((i) => i.id === image.id);

    if (index === -1) newChoseList.push(image);
    else newChoseList.splice(index, 1);

    setChooseList(newChoseList);
  };

  const handleGetMore = () => {
    setPage(page + 1);
    getImages(page + 1);
  };

  const handleSubmit = () => {
    if (multiple) {
      if (chooseList.length) setImageUrl(chooseList);
    } else {
      if (activeImage) setImageUrl([activeImage]);
    }

    closeModal && closeModal();
  };

  const classes = {
    container: "w-[85vw] bg-white h-[80vh] flex flex-col",
    galleryTop:
      "flex justify-between border-b border-black/15 mb-[10px] pb-[10px]",
    galleryBody: "flex-grow overflow-hidden flex mx-[-10px]",
    bodyLeft: "w-full sm:w-2/3 overflow-auto px-[10px]",
    bodyRight:
      "hidden text-sm sm:block px-[10px] overflow-auto pb-3 w-1/3 border-l border-black/15 space-y-[14px]",
  };

  useEffect(() => {
    if (shoudFetchingImage.current) {
      shoudFetchingImage.current = false;
      getImages(1);
    }
  }, []);

  return (
    <>
      <ModalContentWrapper className="w-[900px] h-[500px]">
        <div className={classes.galleryTop}>
          <div className="flex items-center">
            <p className="text-[18px] sm:text-[22px] font-[500]">Gallery</p>
            <Button color="second" className="ml-[10px]" size="clear">
              <label
                className="py-1 px-3 flex items-center"
                htmlFor="image_upload"
              >
                <ArrowUpTrayIcon className="w-5" />
                <span className="hidden sm:block ml-[6px]">Upload</span>
              </label>
            </Button>
          </div>

          <Button size="clear" className="px-3 py-1" onClick={handleSubmit}>
            Ok
          </Button>
        </div>
        <div className={classes.galleryBody}>
          <div className={classes.bodyLeft}>
            <div className="flex flex-wrap mt-[-8px] overflow-x-hidden overflow-y-auto mx-[-4px]">
              {uploadingImages.map((i) => (
                <GalleryItem image={i} active={false}>
                  <ArrowPathIcon className="animate-spin absolute duration-1000 text-[#000] w-7" />
                </GalleryItem>
              ))}

              {images.map((image) => (
                <GalleryItem
                  image={image}
                  active={activeImage?.id === image.id}
                  setActive={() => setActiveImage(image)}
                >
                  {multiple && (
                    <ChooseBtn
                      index={chooseList.findIndex((i) => i.id === image.id)}
                      select={() => handleSelect(image)}
                    />
                  )}
                </GalleryItem>
              ))}

              {isFetching && <Loading />}
            </div>
            {!isLast && (
              <div className="text-center mt-[14px]">
                <Button onClick={handleGetMore} color="second">
                  More
                </Button>
              </div>
            )}
          </div>
          <div className={classes.bodyRight}>
            {activeImage && (
              <>
                <Image
                  className="w-full rounded-lg"
                  src={activeImage.image_url}
                />

                <p className="break-words">{activeImage.name}</p>
                <div>
                  <p>Size: {formatSize(activeImage.size)}</p>
                </div>
                <Button> Delete </Button>
              </>
            )}
          </div>
        </div>
      </ModalContentWrapper>
    </>
  );
}

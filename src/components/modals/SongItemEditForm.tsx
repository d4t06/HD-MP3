import {
   ChangeEvent,
   MouseEventHandler,
   useCallback,
   useMemo,
   useRef,
   useState,
} from "react";
import {
   deleteFile,
   mySetDoc,
   uploadBlob,
   uploadFile,
} from "../../utils/firebaseHelpers";
import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { Image, Button } from "..";
import { useToast, useAuthStore, useSongsStore, useTheme } from "../../store";
import { useEditForm } from "../../hooks";
import { getBlurhashEncode, optimizeImage } from "../../utils/appHelpers";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";

type Props = {
   song: Song;
   admin?: boolean;
   close: () => void;
};

export default function SongItemEditForm({ song, close }: Props) {
   // use store
   const dispatch = useDispatch();
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { setErrorToast, setSuccessToast } = useToast();
   const { currentSong } = useSelector(selectCurrentSong);
   const { updateUserSong } = useSongsStore();

   // state
   const [loading, setLoading] = useState(false);
   const [isImpactOnImage, setIsImpactOnImage] = useState(false);

   const [stockImageURL, setStockImageURL] = useState(song.image_url);
   const [imageURLFromLocal, setImageURLFromLocal] = useState("");
   const [imageFileFromLocal, setImageFileFromLocal] = useState<File>();
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
      isChangeInEdit,
      setValidURL,
   } = useEditForm({
      data: song,
      inputFields,
      imageURLFromLocal,
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
      [imageURLFromLocal, stockImageURL]
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

   const closeModal = () => {
      setLoading(false);
      close();
   };

   const handleCloseEditForm: MouseEventHandler = (e) => {
      e.stopPropagation();
      closeModal();
   };

   const handleEditSong = async () => {
      if (!user) return;

      if (!song.id) {
         setErrorToast({ message: "Edit song wrong data id" });
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
               setErrorToast({});
               return;
            }

            const songImageUrl =
               !!inputFields.image_url && validURL
                  ? inputFields.image_url
                  : newSong.image_url;

            setLoading(true);
            newSong = {
               ...newSong,
               name: inputFields.name,
               singer: inputFields.singer,
               image_url: songImageUrl,
            };

            // check valid
            if (
               newSong.name !== inputFields.name ||
               newSong.singer !== inputFields.singer
            ) {
               console.log("input invalid");
               setErrorToast({});
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
            setLoading(true);

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

               const { encode } = await getBlurhashEncode(imageBlob);
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

         if (currentSong.id === newSong.id) {
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
         setSuccessToast({ message: `Song edited` });
         closeModal();
      } catch (error) {
         console.log({ message: error });

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
            accept="image/*"
            onChange={uploadImageFromLocal}
            className="hidden"
         />
         <h1 className="text-[20px] font-semibold">Edit</h1>
         <div className="flex gap-[20px] mt-[10px] max-[800px]:flex-col">
            <div className="w-[30%] max-[800px]:flex max-[800px]:w-full max-[800px]:gap-[12px]">
               <div className="w-full rounded-[5px] overflow-hidden">
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
                     isLoading={loading}
                     onClick={handleEditSong}
                     className={`${theme.content_bg} rounded-full text-[14px] ${
                        !isAbleToSubmit
                           ? !isImpactOnImage && "pointer-events-none opacity-60"
                           : ""
                     }`}
                     variant={"primary"}
                  >
                     Save
                  </Button>

                  <Button
                     onClick={handleCloseEditForm}
                     className={`bg-${theme.alpha} rounded-full hover:bg-red-500 hover:text-[#fff] text-[14px]`}
                     variant={"primary"}
                  >
                     Close
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

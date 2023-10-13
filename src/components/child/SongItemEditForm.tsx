import {
   ChangeEvent,
   MouseEventHandler,
   useCallback,
   useEffect,
   useMemo,
   useRef,
   useState,
} from "react";
import { Song, ThemeType } from "../../types";
import { deleteFile, mySetDoc, uploadFile } from "../../utils/firebaseHelpers";
import Image from "../ui/Image";
import { ArrowUpTrayIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { useToast } from "../../store/ToastContext";
import { initSongObject } from "../../utils/appHelpers";
import { useAuthStore } from "../../store/AuthContext";

type Props = {
   data: Song;
   setIsOpenModal: (isOpenModal: boolean) => void;
   userSongs?: Song[];
   setUserSongs?: (userSongs: Song[]) => void;
   theme: ThemeType & { alpha: string };
};

// https://e-cdns-images.dzcdn.net/images/cover/a1c402bb54906863dadc4df4325a1627/500x500-000000-80-0-0.jpg

const URL_REGEX = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

export default function SongItemEditForm({
   data,
   setIsOpenModal,
   userSongs,
   setUserSongs,
   theme,
}: Props) {
   // use store
   const { setErrorToast, setSuccessToast } = useToast();
   const {userInfo} = useAuthStore()

   const [loading, setLoading] = useState(false);
   const [stockImageURL, setStockImageURL] = useState(data.image_url);
   const [localImageURL, setLocalImageURL] = useState("");
   const [imageFile, setImageFile] = useState<File>();
   const [inputFields, setInputFields] = useState({
      name: data.name,
      singer: data.singer,
      image_url: "",
   });

   const isHasImpactOnSongImage = useRef(false);

   // for validate
   const [validName, setValidName] = useState(!!data.name);
   const [validSinger, setValidSinger] = useState(!!data.singer);
   const [validURL, setValidURL] = useState(false);

   const inputFileRef = useRef<HTMLInputElement>(null);

   const isChangeInEdit = useMemo(() => {
      if (
         inputFields.name !== data.name ||
         inputFields.singer !== data.singer ||
         inputFields.image_url !== data.image_url ||
         isHasImpactOnSongImage.current
      ) {
         return true;
      }
   }, [inputFields, localImageURL]);

   // priority order
   // - upload image (now => before) (local image url or image file path)
   // - image from url
   const imageToDisplay = useMemo(() => {
      if (localImageURL) return localImageURL;
      else if (stockImageURL) return stockImageURL;
      else if (validURL) return inputFields.image_url;
   }, [inputFields, localImageURL, stockImageURL, data, validURL]);

   const isShowRemoveImageButton = useMemo(
      () => !!localImageURL || !!stockImageURL,
      [localImageURL, stockImageURL]
   );

   const isAbleToSubmit = useMemo(
      () => isChangeInEdit && validName && validName && validURL,
      [validName, validSinger, validURL, isChangeInEdit]
   );

   const handleInput = (field: keyof typeof inputFields, value: string) => {
      setInputFields({ ...inputFields, [field]: value });
   };

   //   trigger only have image from local
   const handleUnsetImage = useCallback(() => {
      // main case 1: user has upload image before
      // case 1: user remove current image
      if (data.image_file_path && !localImageURL) {
         setStockImageURL("");

         // case 2: after upload, user remove image
      } else if (localImageURL) {
         setLocalImageURL("");
         setImageFile(undefined);
      }

      // main case 2: user never upload image before
      setStockImageURL("");

      isHasImpactOnSongImage.current = true;

      const inputEle = inputFileRef.current as HTMLInputElement;
      if (inputEle) {
         inputEle.value = "";
      }
   }, []);

   const uploadImageFromLocal = useCallback((e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement & { files: FileList };

      const imageFile = target.files[0];
      setLocalImageURL(URL.createObjectURL(imageFile));

      isHasImpactOnSongImage.current = true;
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

   // inputFields, imageFile, userSongs, data
   // don't need isChangeInEdit cause inputFields change => isChangeInEdit change
   const handleEditSong = useCallback(async () => {
      // check props
      if (!userSongs || !setUserSongs) {
         setErrorToast({ message: "Lack of props" });
         return;
      }

      if (!data.id) {
         setErrorToast({});
         return;
      }

      try {
         let newUserSongs: Song[] = [];
         let newSong: Song = { ...data };

         if (isChangeInEdit) {
            // check valid input
            if (!inputFields.name || !inputFields.singer) {
               setErrorToast({});
               return;
            }

            const songImageUrl = isHasImpactOnSongImage.current
               ? ""
               : inputFields.image_url && validURL
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
            if (newSong.name !== inputFields.name || newSong.singer !== inputFields.singer) {
               setErrorToast({});
               return;
            }

            // user upload song from local
            if (imageFile && isHasImpactOnSongImage.current) {
               const { filePath, fileURL } = await uploadFile({
                  file: imageFile,
                  folder: "/images/",
                  email: userInfo.email
               });
               newSong.image_file_path = filePath;
               newSong.image_url = fileURL;

               // if user remove image
            } else if (isHasImpactOnSongImage.current) {
               newSong.image_file_path = "";
            }

            console.log("check new song", newSong);

            // update user songs
            newUserSongs = [...userSongs];
            const index = newUserSongs.findIndex((song) => song.id === newSong.id);
            if (index === -1) {
               setErrorToast({ message: "No index found" });
               return;
            }

            newUserSongs[index] = newSong;
         }

         // if user upload image or unset image
         if (isHasImpactOnSongImage.current) {
            if (data.image_file_path) {
               // >>> api
               deleteFile({ filePath: data.image_file_path });
            }
         }

         // >>> local
         setUserSongs(newUserSongs);

         // >>> api
         await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });

         // >>> finish
         setSuccessToast({ message: `${newSong.name} edited` });
      } catch (error) {
         setErrorToast({});
         console.log(error);
      } finally {
         closeModal();
      }
   }, [inputFields, imageFile, userSongs, data]);

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

   // define style
   const classes = {
      textColor: theme.type === "light" ? "text-[#333]" : "text-[#fff]",
      input: `px-[10px] py-[5px] rounded-[4px] bg-transparent border border-${theme.alpha} text-[14px] font-[500]`,
   };

   return (
      <div className="w-[50vw] h-[auto]">
         <input
            ref={inputFileRef}
            id="editImageInput"
            type="file"
            onChange={uploadImageFromLocal}
            className="hidden"
         />
         <h1 className="text-[20px] font-semibold">Edit</h1>
         <div className="flex mt-[10px]">
            <div>
               <div className="w-[130px] h-[130px] flex-shrink-0 rounded-[5px]">
                  <Image onError={() => setValidURL(false)} src={imageToDisplay} />
               </div>

               <div className="flex items-center gap-[12px] mt-[10px]">
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
            <div className="ml-[20px] w-full flex flex-col gap-[10px]">
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
                     placeholder={data.name}
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
                     placeholder={data.singer}
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
                        !isAbleToSubmit && "pointer-events-none opacity-60"
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

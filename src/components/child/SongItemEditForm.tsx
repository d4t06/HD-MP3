import { ChangeEvent, MouseEventHandler, useCallback, useMemo, useRef, useState } from "react";
import { Song, ThemeType } from "../../types";
import { deleteFile, mySetDoc, uploadFile } from "../../utils/firebaseHelpers";
import Image from "../ui/Image";
import { ArrowUpTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Button from "../ui/Button";
import { useToast } from "../../store/ToastContext";

type Props = {
   data: Song;
   setIsOpenModal: (isOpenModal: boolean) => void,
   userSongs?: Song[],
   setUserSongs?: (userSongs: Song[]) => void,
   theme: ThemeType & {alpha: string}
};

export default function SongItemEditForm({ data, setIsOpenModal, userSongs, setUserSongs, theme }: Props) {
   const {setErrorToast, setSuccessToast} = useToast()
   const [loading, setLoading] = useState(false)

   const [localImageURL, setLocalImageURL] = useState("");
   const [imageFile, setImageFile] = useState<File>();
   const isImageFileFieldChange = useRef(false);
   const [inputFields, setInputFields] = useState({
      name: data.name,
      singer: data.singer,
      image_url: data.image_url,
   });

   const stockImageURL = useRef(data.image_url);
   const inputFileRef = useRef<HTMLInputElement>(null);


   const isChangeInEdit = useMemo(() => {
      if (
         inputFields.name !== data.name ||
         inputFields.singer !== data.singer ||
         inputFields.image_url !== data.image_url ||
         isImageFileFieldChange.current
      ) {
         return true;
      }
   }, [inputFields, localImageURL]);



   const handleInput = (field: keyof typeof inputFields, value: string) => {
      setInputFields({ ...inputFields, [field]: value });
   };

   const handleUnsetImage = () => {
      // case 1: user remove current image
      if (localImageURL === inputFields.image_url) {
         setLocalImageURL("");
         handleInput("image_url", "");

         // case 2: after upload, user remove image
      } else {
         setLocalImageURL("");
         setImageFile(undefined);
      }

      isImageFileFieldChange.current = true;

      const inputEle = inputFileRef.current as HTMLInputElement;
      if (inputEle) {
         inputEle.value = "";
      }
   };

   const uploadImageFromLocal = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement & { files: FileList };

      const imageFile = target.files[0];
      setLocalImageURL(URL.createObjectURL(imageFile));

      isImageFileFieldChange.current = true;
      setImageFile(imageFile);
   };

   const unsetImage = () => {
      setImageFile(undefined);
      setLocalImageURL("");
   };

   const handleCloseEditForm: MouseEventHandler = (e) => {
      e.stopPropagation();
      setIsOpenModal(false);

      if (data.image_url === stockImageURL.current) {
         handleInput("image_url", stockImageURL.current);
      }
   };
   const handleEditSong = useCallback(async () => {
      if (!userSongs || !setUserSongs) {
         console.log("edit fail usersongs not found");
         return;
      }

      try {
         // if user change image
         if (isImageFileFieldChange.current) {
            // case 1: remove image_url
            // ...

            // case 2: remove uploaded image
            const filePath = data.image_file_path;
            if (filePath) {
               deleteFile({ filePath });
            }
         }

         if (isChangeInEdit) {
            console.log("change in edit");

            setLoading(true);
            let newSong: Song = { ...data, ...inputFields };

            // user upload song from local
            if (imageFile && isImageFileFieldChange.current) {
               const { filePath, fileURL } = await uploadFile({
                  file: imageFile,
                  folder: "/images/",
               });
               newSong.image_file_path = filePath;
               newSong.image_url = fileURL;

               // if user remove image
            } else if (isImageFileFieldChange.current) {
               newSong.image_file_path = "";
               newSong.image_url = "";
            }

            await mySetDoc({ collection: "songs", data: newSong, id: newSong.id });

            let newUserSongs = [...userSongs];
            // get index of deleted song in userSongs
            const index = newUserSongs.indexOf(newSong);
            newUserSongs.splice(index, 1);

            setUserSongs(newUserSongs);
            setSuccessToast({ message: `${newSong.name} edited` });
         }
      } catch (error) {
         setErrorToast({});
      } finally {
         // closeModal();
         unsetImage();
      }
   }, [inputFields, localImageURL]);


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
         <h1 className="text-[20px] font-semibold">Chỉnh sửa</h1>
         <div className="flex mt-[10px]">
            <div>
               <div className="w-[130px] h-[130px] flex-shrink-0 rounded-[5px]">
                  <Image src={localImageURL || inputFields.image_url} />
               </div>

               <div className="flex items-center gap-[12px] mt-[10px]">
                  <label
                     htmlFor="editImageInput"
                     className={`inline-block cursor-pointer hover:brightness-90 px-[20px] py-[5px] bg-${theme.alpha} rounded-full text-[14px]`}
                  >
                     <ArrowUpTrayIcon className="w-[15px]" />
                  </label>
                  {localImageURL && (
                     <Button
                        onClick={() => handleUnsetImage()}
                        className={`inline-block hover:brightness-90 px-[20px] py-[5px] ${theme.content_bg} rounded-full text-[14px]`}
                     >
                        <XMarkIcon className="w-[15px]" />
                     </Button>
                  )}
               </div>
            </div>
            <div className="ml-[20px] w-full flex flex-col gap-[10px]">
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Tên: </p>
                  <input
                     className={`${classes.input} ${classes.textColor}`}
                     value={inputFields.name}
                     type="text"
                     onChange={(e) => handleInput("name", e.target.value)}
                  />
               </div>
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Thể hiện: </p>
                  <input
                     className={classes.input}
                     value={inputFields.singer}
                     onChange={(e) => handleInput("singer", e.target.value)}
                     type="text"
                  />
               </div>
               <div className="flex flex-col gap-[5px]">
                  <p className="text-[14px]">Url ảnh: </p>
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
                     onClick={() => handleEditSong()}
                     className={`bg-${theme.alpha} rounded-full text-[14px] ${
                        !isChangeInEdit && "pointer-events-none opacity-60"
                     }`}
                     variant={"primary"}
                  >
                     Lưu
                  </Button>
                  <Button
                     onClick={handleCloseEditForm}
                     className={`${theme.content_bg} rounded-full text-[14px]`}
                     variant={"primary"}
                  >
                     Đóng
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}

// import { useEffect, useState } from "react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
// import TestUsememo from "./components/TestComponent";
import {
   addDoc,
   collection,
   doc,
   getDoc,
   getDocs,
   setDoc,
   where,
} from "firebase/firestore";
import { auth, db, store } from "../config/firebase";
import { Lyric, Song, User } from "../types";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { parserImageFile } from "../utils/parserImage";
import {
   ArrowPathIcon,
   ArrowUpTrayIcon,
   PauseCircleIcon,
   PlayCircleIcon,
} from "@heroicons/react/24/outline";
import { useTheme } from "../store/ThemeContext";
import Button from "../components/ui/Button";
import LyricItem from "../components/ui/LyricItem";
import LyricEditor from "../components/LyricEditor";
import { generateSongId } from "../utils/generateSongId";
import { useAuthState } from "react-firebase-hooks/auth";

function App() {
   const [loggedInUser] = useAuthState(auth);

   const [isCanUpload, setIsCanUpload] = useState<boolean>(false);
   const [inputFiels, setInputFields] = useState<Song>({
      file_name: '',
      name: "",
      singer: "",
      image_path: "",
      song_path: "",
      by: "",
      duration: 0,
      lyric_id: "",
   });

   const { theme } = useTheme();

   const [songFile, setSongFile] = useState<File>();
   const [imageFile, setImageFile] = useState<File>();
   const [errorMsg, setErrorMsg] = useState<string>("");

   const [songURL, setSongURL] = useState<string>("");
   const [isUpload, setIsUpload] = useState(false);

   const [lyricStr, setLyricStr] = useState<string>("");
   const [lyricResult, setLyricResult] = useState<Lyric[]>([]);

   const audioRef = useRef<HTMLAudioElement>(null);
   const songNameRef = useRef<HTMLParagraphElement>(null);
   const songsCollectionRef = collection(db, "songs");

   // const lyricArrayRef = useRef<string[]>([]);

   const handleInput = (field: keyof typeof inputFiels, value: string | number) => {
      setInputFields({ ...inputFiels, [field]: value });
   };

   const hanleSetSongFile = async (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement & { files: FileList };
      const file = target.files[0];      

      const songData = await parserImageFile(file);
      if (!songData) return;

      setSongFile(file);
      setSongURL(URL.createObjectURL(file));
      setInputFields({
         ...inputFiels,
         name: songData.name,
         singer: songData.singer,
      });

      if (songData.lyric) {
         setLyricStr(songData.lyric);
      }
   };

   const handleSetImageFile = (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLElement & { files: FileList };
      const file = target.files[0];
      setImageFile(file);
   };

   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsUpload(true);

      // await addToDB({...inputFiels});
      // return;

      try {
         // nếu không có file (submit bằng js hack)
         if (typeof songFile === "undefined") return;
         let imageRes, imageProcess, imageUrl, lyricId;

         // promise upload nhạc
         const songRef = ref(store, `/songs/${inputFiels.name}`);
         const songProcess = uploadBytes(songRef, songFile);

         // nếu người dùng có thêm lời cho bài hát
         if (lyricResult.length) {
            const lyricCollectionRef = collection(db, "lyrics");

            lyricId = generateSongId({ ...inputFiels });
            const lyricDocRef = doc(lyricCollectionRef, lyricId);

            await setDoc(lyricDocRef, { lyric: lyricResult });
         }

         // nếu có người dùng tải hình ảnh từ máy lên
         if (typeof imageFile != "undefined") {
            const imageRef = ref(store, `/images/${imageFile.name}`);
            imageProcess = uploadBytes(imageRef, imageFile);
         }

         // thực hiện up nhạc và lấy url
         const songRes = await songProcess;
         const songUrl = await getDownloadURL(songRes.ref);


         console.log("check song res", songRes);
         

         //  thực hiện up ảnh và lấy url
         if (imageProcess) {
            imageRes = await imageProcess;
            imageUrl = await getDownloadURL(imageRes.ref);
         }         

         const data: Song = {
            ...inputFiels,
            by: loggedInUser?.email as string,
            image_path: imageUrl ? imageUrl : inputFiels.image_path,
            song_path: songUrl,
            file_name: songRes.metadata.fullPath,
            lyric_id: lyricId || ""
         };

         // thêm vào database
         await addToDB(data);

         // console.log("check data", data);
      } catch (error) {
         console.log({ message: error });
      }
   };

   const addToDB = async (data: Song) => {
      try {
         let id = data.lyric_id || generateSongId(data);

         await setDoc(doc(db, "songs", id), data);

         const userDocRef = doc(db, 'users', loggedInUser?.email as string);
         const userSnapShot = await getDoc(userDocRef);
         const userData = userSnapShot.data() as User;

         await setDoc(userDocRef, { songs: userData?.songs ? [...userData.songs, id] : [id] }, {merge: true});

      } catch (error) {
         console.log({ message: error });
      } finally {
         setIsUpload(false);
      }
   };

   useEffect(() => {
      if (!songFile || !inputFiels.name || !inputFiels.singer || !inputFiels.duration) {
         setIsCanUpload(false);
      } else {
         setIsCanUpload(true);
      }
   }, [songFile, inputFiels]);

   useEffect(() => {
      const handleLoaded = () => {
         setInputFields({
            ...inputFiels,
            duration: +audioEle.duration.toFixed(1),
         });
      };

      // if (inputFiels.lyric) {
      // lyricArrayRef.current = inputFiels.lyric.
      // }
      const audioEle = audioRef.current as HTMLAudioElement;
      if (!audioEle) return;
      audioEle.addEventListener("loadedmetadata", handleLoaded);

      return () => URL.revokeObjectURL(songURL);
   }, [songURL]);

   const textColor = theme.type === "light" ? " text-[#333] " : " text-[#fff] ";
   const style = {
      row: "flex justify-between gap-[20px]",
      col: "flex-grow flex flex-col gap-[20px]",
      section:
         "bg-" +
         theme.alpha +
         textColor +
         "py-[40px] px-[20px] rounded-[12px] mb-[30px] w-full ",
      formGroup: "flex flex-col gap-[5px] flex-grow",
      label: "text-md font-[500]",
      input:
         theme.content_bg +
         " px-[10px] py-[5px] rounded-[4px] bg-[#f1f1f1] outline-none text-[#333] font-[500]",
      button:
         theme.content_bg +
         " rounded-[8px] py-[5px] px-[20px] flex justify-center items-center hover:brightness-75",
      disable: " opacity-60 pointer-events-none ",
      icon: "h-[20px] w-[20px]",
      lyricBox: "list-none border-r h-full",
   };

   // console.log("check lyricArrayRef ", lyricArrayRef.current);
   // console.log("check is can uplaod", isCanUpload);

   return (
      <form className="pb-[100px] " action="" onSubmit={(e) => handleSubmit(e)}>
         <div className={style.section}>
            <div className="flex gap-[20px] items-center mb-[20px]">
               <input
                  className="hidden"
                  id="file"
                  onChange={(e) => hanleSetSongFile(e)}
                  type="file"
               />

               <label className={`${style.button} `} htmlFor="file">
                  <ArrowUpTrayIcon className={style.icon} />
                  <span className="flex-shrink-0 ml-[10px]">Chose file</span>
               </label>
               <p ref={songNameRef} className="">
                  {typeof songFile != "undefined" && (
                     <>
                        {inputFiels.name} ( {inputFiels.duration}s )
                     </>
                  )}
               </p>
               <audio className="hidden" ref={audioRef} src={songURL} controls />
            </div>

            <div className={style.row}>
               <div className={style.col}>
                  <div className={style.formGroup}>
                     <label className={style.label} htmlFor="">
                        Name
                     </label>
                     <input
                        type="text"
                        className={style.input}
                        onChange={(e) => handleInput("name", e.target.value)}
                        value={inputFiels.name}
                     />
                  </div>
                  <div className={style.formGroup}>
                     <label className={style.label} htmlFor="">
                        Singer
                     </label>
                     <input
                        type="text"
                        className={style.input}
                        onChange={(e) => handleInput("singer", e.target.value)}
                        value={inputFiels.singer}
                     />
                  </div>
               </div>
               <div className={style.col}>
                  <div className={style.formGroup}>
                     <label className={style.label} htmlFor="">
                        Image
                     </label>
                     <input
                        placeholder="URL..."
                        type="text"
                        className={style.input}
                        value={inputFiels.image_path}
                        disabled={typeof imageFile != "undefined"}
                        onChange={(e) => handleInput("image_path", e.target.value)}
                     />
                     <input
                        disabled={!!inputFiels.image_path}
                        type="file"
                        onChange={(e) => handleSetImageFile(e)}
                     />
                  </div>
               </div>
            </div>
         </div>
         <div className={style.section}>
            {audioRef.current && (
               <LyricEditor
                  lyricResult={lyricResult}
                  setLyricResult={setLyricResult}
                  lyricParsed={lyricStr}
                  audioEle={audioRef.current}
                  theme={theme}
                  disable={typeof songFile === "undefined" ? true : false}
               />
            )}
         </div>

         <button
            className={
               style.button + ` w-[10vw] ${isUpload || !isCanUpload ? style.disable : ""}`
            }
            type="submit"
         >
            <span>
               {isUpload ? (
                  <ArrowPathIcon className="h-[25px] w-[25px] animate-spin" />
               ) : (
                  "Add"
               )}
            </span>
         </button>
         <p>{errorMsg}</p>
      </form>
   );
}

export default App;

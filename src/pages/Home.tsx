import {
   ArrowPathIcon,
   ChevronRightIcon,
   ClipboardDocumentIcon,
   HeartIcon,
   MusicalNoteIcon,
   PlusCircleIcon,
} from "@heroicons/react/24/outline";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Song } from "../types";
// import { songs } from "../utils/songs";

import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { useSongs } from "../store/SongsContext";
import { useTheme } from "../store/ThemeContext";

import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import {
   collection,
   doc,
   getDoc,
   getDocs,
   query,
   setDoc,
   where,
} from "firebase/firestore";
import { auth, db, store } from "../config/firebase";

import { routes } from "../routes";

import SongListItem from "../components/ui/SongListItem";
import Button from "../components/ui/Button";
import LinkItem from "../components/ui/LinkItem";
import SongItem from "../components/ui/SongItem";
import { parserImageFile } from "../utils/parserImage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { generateSongId } from "../utils/generateSongId";

type SongWithStatus = Song & { status: string };

export default function HomePage() {
   const dispatch = useDispatch();
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;
   const { theme } = useTheme();
   const [loggedInUser, _loading, _error] = useAuthState(auth);

   const [isUpload, setIsUpload] = useState(false);
   // const [duration, setDuration] = useState(99)
   const [tempSongs, setTempSongs] = useState<SongWithStatus[]>([]);
   const [inProcessIndexs, setInProcessIndexs] = useState<number[]>([]);

   const audioRef = useRef<HTMLAudioElement>(null);
   const duration = useRef(0);

   const [signInWithGoogle] = useSignInWithGoogle(auth);

   const { songs, setSongs } = useSongs();
   const songsColectionRef = collection(db, "songs");
   const queryGetAdminSongs = query(songsColectionRef, where("by", "==", "admin"));

   const handleSetSong = (song: Song, index: number) => {
      dispatch(setSong({ ...song, currentIndex: index }));
   };

   const windowWidth = window.innerWidth;
   const iconClasses = `w-6 h-6 mr-2 inline`;

   console.log("loggedInUser");

   const signIn = () => {
      signInWithGoogle();
   };

   const handleUploadSong = async (song: Song) => {
      console.log("upload song duration", duration.current, "ready", );


      // if ()

      let songWithDuration: Song = { ...song, duration: duration.current || 99 };
      try {
         let id = song.lyric_id || generateSongId(song);

         await setDoc(doc(db, "songs", id), songWithDuration);

         console.log("add to db");

         // update songs list of loggedInUser
         // const userDocRef = doc(db, 'users', loggedInUser?.email as string);
         // const userSnapShot = await getDoc(userDocRef);
         // const userData = userSnapShot.data() as User;
         // await setDoc(userDocRef, { songs: userData?.songs ? [...userData.songs, id] : [id] }, {merge: true});
      } catch (error) {
         console.log({ message: error });
      }
   };

   const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
      const target = e.target as HTMLInputElement & { files: FileList };
      const fileLists = target.files;

      let data: Song = {
         id: "",
         name: "",
         singer: "",
         image_path: "",
         file_name: "",
         song_path: "",
         by: "admin",
         duration: 0,
         lyric_id: "",
      };

      setIsUpload(true);
      for (let songFile of fileLists) {
         const songData = await parserImageFile(songFile);

         if (songData) {
            const songRef = ref(store, `/songs/${songData.name}`);
            const fileRes = await uploadBytes(songRef, songFile);
            const songUrl = await getDownloadURL(fileRes.ref);

            const audioEle = audioRef.current as HTMLAudioElement;
            audioEle.src = URL.createObjectURL(songFile);

            let songItem: Song = {
               ...data,
               file_name: fileRes.metadata.fullPath,
               name: songData?.name,
               singer: songData.singer,
               song_path: songUrl,
            };

            await handleUploadSong(songItem);
         }
      }
      setIsUpload(false);

      // setInProcessIndexs(Array.from(Array(songLists.length).keys()));
   };

   useEffect(() => {
      const getSongs = async () => {
         try {
            const songsSnap = await getDocs(queryGetAdminSongs);

            if (songsSnap) {
               const songsList = songsSnap.docs?.map((doc) => {
                  const songsData = doc.data() as Song;

                  return { ...songsData, id: doc.id };
               });

               if (songsList) {
                  setSongs(songsList);
               }
            }
         } catch (error) {
            console.log({ message: error });
         }
      };

      const audioEle = audioRef.current as HTMLAudioElement;
      audioEle.addEventListener("loadedmetadata", () => {
         if (audioEle.src) {
            console.log("loadedmetadata");
            duration.current = audioEle.duration;

            URL.revokeObjectURL(audioEle.src);
         }
      });

      if (!songs.length) {
         // getSongs();
      }
   }, []);

   console.log("check inprocess", inProcessIndexs);

   return (
      <>
         {/* mobile nav */}
         {/* {windowWidth <= 549 && (
        <div className="pb-[20px]">
          <div className="flex flex-col gap-3 items-start ">
            <h1 className="text-[24px] font-bold">Library</h1>

            {loggedInUser ? (
              <>
                <LinkItem
                  className="py-[10px] border-b border-[#333]"
                  to={routes.playlist}
                  icon={
                    <ClipboardDocumentIcon
                      className={iconClasses + theme.content_text}
                    />
                  }
                  label="Playlist"
                  arrowIcon={
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  }
                />
                <LinkItem
                  className="py-[10px] border-b border-[#333]"
                  to={routes.allSong}
                  icon={
                    <MusicalNoteIcon
                      className={iconClasses + theme.content_text}
                    />
                  }
                  label="All songs"
                  arrowIcon={
                    <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                  }
                />
              </>
            ) : (
              <Button
                onClick={signIn}
                className={`${theme.content_bg} rounded-[4px] px-[40px]`}
                variant={"primary"}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      )} */}
         <div className="pb-[30px]">
            <h3 className="text-[24px] font-bold mb-[10px]">Popular</h3>
            <audio ref={audioRef} src=""></audio>
            <input
               onChange={handleInputChange}
               type="file"
               multiple
               accept=".mp3"
               id="file"
               className="hidden"
            />
            <label
               className={`${theme.content_bg} rounded-full w-fit flex px-[20px] py-[4px] cursor-pointer`}
               htmlFor="file"
            >
               {!isUpload ? (
                  <>
                     <PlusCircleIcon className="w-[20px] mr-[5px]" />
                     Upload
                  </>
               ) : (
                  <ArrowPathIcon className="w-[20px] animate-spin" />
               )}
            </label>

            {/* admin song */}
            {!!songs.length || !!tempSongs.length ? (
               <>
                  <div className="flex flex-row flex-wrap gap-y-5 -mx-4">
                     {songs.map((song, index) => {
                        return (
                           <div
                              key={index}
                              className="w-full px-[10px] max-[549px]:w-full"
                           >
                              <SongListItem
                                 theme={theme}
                                 data={song as Song}
                                 active={song.song_path === songInStore.song_path}
                                 onClick={() => handleSetSong(song, index)}
                              />
                           </div>
                        );
                     })}

                     {tempSongs.map((song, index) => {
                        return (
                           <div
                              key={index}
                              className="w-full px-[10px] max-[549px]:w-full"
                           >
                              <SongListItem
                                 theme={theme}
                                 data={song}
                                 active={false}
                                 inProcess={
                                    !!inProcessIndexs.some(
                                       (inProIndex) => inProIndex + "" === index + ""
                                    )
                                 }
                                 onClick={() => handleSetSong(song, index)}
                              />
                           </div>
                        );
                     })}
                  </div>
               </>
            ) : (
               "No songs jet..."
            )}
         </div>

         {/* {windowWidth >= 550 && (
            <div className="pb-[30px]">
               <h3 className="text-xl font-bold mb-[10px]">All songs</h3>

               {!!songs[0].name ? (
                  <>
                     <div className="flex flex-row flex-wrap gap-y-5 -mx-4">
                        {!!songs[0].name &&
                           songs.map((song, index) => {
                              return (
                                 <div
                                    key={index}
                                    className="w-1/2 px-[10px] max-[549px]:w-full"
                                 >
                                    <SongListItem
                                       theme={theme}
                                       onClick={() =>
                                          handleSetSong(song, index)
                                       }
                                       active={
                                          song.image_path ===
                                          songInStore.image_path
                                       }
                                       key={index}
                                       data={song}
                                    />
                                 </div>
                              );
                           })}
                     </div>
                  </>
               ) : (
                  "No songs jet..."
               )}
            </div>
         )} */}
      </>
   );
}

import { auth, db, store } from "../config/firebase";
import { FieldPath, addDoc, doc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import {
  ChangeEvent,
  Dispatch,
  RefObject,
  ReactNode,
  useRef,
  useState,
  MutableRefObject,
} from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Song } from "../types";
import { parserImageFile } from "../utils/parserImage";
import { generateSongId } from "../utils/generateSongId";
import useUserSong from "./useUserSong";
import { useSongs } from "../store/SongsContext";

type ModalName = "ADD_PLAYLIST" | "MESSAGE";
type Props = {
  audioRef: RefObject<HTMLAudioElement>;
  message: MutableRefObject<string>;
  handleOpenModal: (name: ModalName) => void;
};

// event listener
// await promise
// object assign
export default function useUploadSongs({
  audioRef,
  message,
  handleOpenModal,
}: Props) {
  const { setSongs, songs: userSongs } = useSongs();
  const [status, setStatus] = useState<
    "uploading" | "finish" | "idle" | "finish-error"
  >("idle");
  const [tempSongs, setTempSongs] = useState<Song[]>([]);
  const [addedSongs, setAddedSongs] = useState<string[]>([]);

  const [loggedInUser] = useAuthState(auth);
  const actuallyFileIds = useRef<number[]>([]);
  const isDuplicate = useRef(false);
  // const { songs: userSongs } = useUserSong()

  const handleInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setStatus("uploading");
    const target = e.target as HTMLInputElement & { files: FileList };
    const fileLists = target.files;
    let data: Song = {
      id: "",
      name: "",
      singer: "",
      image_path: "",
      file_name: "",
      song_path: "",
      by: loggedInUser?.email as string,
      duration: 0,
      lyric_id: "",
    };

    let songsList: Song[] = [];

    if (userSongs.length + fileLists.length > 10) {
      console.log(">>> overload");
      setStatus("finish-error");
      message.current = "overload";
      handleOpenModal("MESSAGE");
      return;
    }

    // handle file change, add tempSongs and upload song
    try {
      // init tempsSongs, push actuallyFileIds
      let i;
      for (i = 0; i <= fileLists.length - 1; i++) {
        const songFile = fileLists[i];
        const songData = await parserImageFile(songFile);
        if (songData) {
          // inti song data
          let songFileObject: Song = {
            ...data,
            name: songData.name,
            singer: songData.singer,
          };

          // check duplicate file
          const checkDuplicate = () =>
            userSongs.some(
              (song) =>
                song.singer === songFileObject.singer &&
                song.name === songFileObject.name
            );
          if (checkDuplicate()) {
            console.log(">>>duplicate");
            isDuplicate.current = true;
            continue;
          }

          songsList.push(songFileObject);

         //  console.log("i =", i, fileLists[i].name);

          // add actuallyFileIds, and assign for_song_id to actuallyFile
          actuallyFileIds.current = [...actuallyFileIds.current, i];
          Object.assign(songFile, { for_song_id: songsList.length - 1 } as {
            for_song_id: number;
          });
        }
      }

      // if no has new songItem after change songs file =>  open modal, return
      if (!songsList.length) {
        message.current = "duplicate files upload";
        setStatus("finish-error");
        handleOpenModal("MESSAGE");

        return;
      }

      // inti songItem to render to view
      setTempSongs(songsList);

      // update tempSongs data after upload each song file

      for (let fileIndex of actuallyFileIds.current) {
        console.log("check fileIndex", fileIndex);
        let newSongFile = fileLists[fileIndex] as File & {
          for_song_id: number;
        };

        //  upload song file
        // const fileRef = ref(store, `/songs/${songFile.name}`);
        // const fileRes = await uploadBytes(fileRef, songFile);
        // const fileUrl = await getDownloadURL(fileRes.ref);

        // update songItem data
        const songId = generateSongId(songsList[newSongFile.for_song_id]);
        songsList[newSongFile.for_song_id] = {
          ...songsList[newSongFile.for_song_id],
          id: songId,
          // file_name: fileRes.metadata.fullPath,
          // song_path: fileUrl,
        };

        //  update audio src
        const audioEle = audioRef.current as HTMLAudioElement;
        audioEle.src = URL.createObjectURL(newSongFile);

        // upload song doc
        await handleUploadSong(songsList, newSongFile.for_song_id);
      }
    } catch (error) {
      console.log(error);
      setStatus("finish");
    }

    // upload user data
    try {
      console.log("user doc updated");
      actuallyFileIds.current = [];
      // update uploaded songs list of loggedInUser after update list of songs
      // const userDocRef = doc(db, "users", loggedInUser?.email as string);
      // const allUserSongs: string[] = userSongs.map((song) => song.id);

      // const newUserSongs = [...allUserSongs, ...addedSongs]
      // await setDoc(
      //    userDocRef,
      //    {
      //       songs: newUserSongs,
      //       song_count: newUserSongs.length,
      //    },
      //    { merge: true }
      // );
    } catch (error) {
      console.log(error);
    } finally {
      // update songs to context store

      if (songsList.length) {
        setTempSongs([]);
        setSongs([...songsList, ...userSongs]);
      }
      if (isDuplicate.current) {
        message.current = "duplicate files upload";
        setStatus("finish-error");
        handleOpenModal("MESSAGE");
      } else {
        setStatus("finish");
      }
    }
  };

  // get song duration and upload song doc
  const handleUploadSong = (songsList: Song[], index: number) =>
    new Promise<void>((resolve) => {
      const audioEle = audioRef.current as HTMLAudioElement;
      const upload = async () => {
        setTimeout(async () => {
          let song = songsList[index];
          song = {
            ...song,
            duration: +audioEle.duration.toFixed(1) || 99,
            song_path:
              "https://firebasestorage.googleapis.com/v0/b/zingmp3-clone-61799.appspot.com/o/songs%2FLet%20Me%20Down%20Slowly?alt=media&token=398f4f56-abdf-414d-9549-6522c7379e7e",
          };

          songsList[index] = song;

          // await setDoc(doc(db, 'songs', song.id), song)

          console.log("set added song");
          setTempSongs(songsList);
          setAddedSongs((prev) => [...prev, song.id]);

          console.log("set added song");

          // console.log('song doc added');

          audioEle.removeEventListener("loadedmetadata", upload);
          URL.revokeObjectURL(audioEle.src);

          resolve();
        },1000);
      };

      audioEle.addEventListener("loadedmetadata", upload);
    });

  // console.log("addedSongs ", addedSongs);

  return { tempSongs, setTempSongs, addedSongs, status, handleInputChange };
}

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
import { useSongsStore } from "../store/SongsContext";

type ModalName = "ADD_PLAYLIST" | "MESSAGE";
type Props = {
  audioRef: RefObject<HTMLAudioElement>;
  message: MutableRefObject<string>;
  handleOpenModal: (name: ModalName) => void;
  duplicatedFile: MutableRefObject<Song[]>;
  admin?: boolean
};

// event listener
// await promise
// object assign
export default function useUploadSongs({
  audioRef,
  message,
  handleOpenModal,
  duplicatedFile,
  admin
}: Props) {
  const [loggedInUser] = useAuthState(auth)
  const { setUserSongs, userSongs } = useSongsStore();

  const [status, setStatus] = useState<
    "uploading" | "finish" | "idle" | "finish-error"
  >("idle");
  const [tempSongs, setTempSongs] = useState<Song[]>([]);
  const [addedSongIds, setAddedSongIds] = useState<string[]>([]);

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
      by: admin ? 'admin' : loggedInUser?.email as string,
      duration: 0,
      lyric_id: "",
    };

    let songsList: Song[] = [];

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
            duplicatedFile.current.push(songFileObject)
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

      if (userSongs.length + actuallyFileIds.current.length > 10) {
        console.log(">>> overload");
        setStatus("finish-error");
        message.current = "You have reach the limit of songs";
        handleOpenModal("MESSAGE");
        return;
      }

      // if no has new songItem after change songs file =>  open modal, return
      if (!songsList.length) {
        message.current = "Duplicated file";
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

        // //  upload song file
        const fileRef = ref(store, `/songs/${newSongFile.name}`);
        const fileRes = await uploadBytes(fileRef, newSongFile);
        const fileUrl = await getDownloadURL(fileRes.ref);

        // generateSongId
        const songId = generateSongId(songsList[newSongFile.for_song_id], loggedInUser?.email as string);
        songsList[newSongFile.for_song_id] = {
          ...songsList[newSongFile.for_song_id],
          id: songId,
          file_name: fileRes.metadata.fullPath,
          song_path: fileUrl,
        };

        //  update audio src
        const audioEle = audioRef.current as HTMLAudioElement;
        audioEle.src = URL.createObjectURL(newSongFile);

        // upload song doc
        await handleUploadSong(songsList, newSongFile.for_song_id);
      }

      // if (!admin) uploadUserData(songsList)
    } catch (error) {
      console.log(error);
      setStatus("finish");
    }

    // upload user data
    try {
      // reset fileList
      actuallyFileIds.current = [];


      if (!admin) {
        console.log('upload user data');
        
        // update uploaded songs list of loggedInUser after update list of songs
        const userDocRef = doc(db, "users", loggedInUser?.email as string);
        const userSongIds: string[] = userSongs.map((song) => song.id);
        const actuallySongsListIds: string[] = songsList.map(song => song.id)
        const newUserSongsIds = [...userSongIds, ...actuallySongsListIds]

        // update user doc
        await setDoc(
          userDocRef,
          {
            song_ids: newUserSongsIds,
            song_count: newUserSongsIds.length,
          },
          { merge: true }
        );

        // update songs to context store
        if (songsList.length) {
          setTempSongs([]);
          setUserSongs([...songsList, ...userSongs]);
        }
      }

      setTempSongs([]);
      if (isDuplicate.current) {
        message.current = "Duplicate file";
        setStatus("finish-error");
        handleOpenModal("MESSAGE");
      } else {
        setStatus("finish");
      }

    } catch (error) {
      console.log(error);
    }
  };

  const uploadUserData = () => {
    console.log('check addedSongIds', addedSongIds)
  }

  // get song duration and upload song doc
  const handleUploadSong = async (songsList: Song[], index: number) => {
    return new Promise<void>((resolve) => {
      const audioEle = audioRef.current as HTMLAudioElement;
      const upload = async () => {

        let song = songsList[index];
        const duration = +audioEle.duration.toFixed(1) || 99
        song = {
          ...song,
          duration
        };
        songsList[index] = song;

        await setDoc(doc(db, 'songs', song.id), song)
        console.log("Song doc added");

        setTempSongs(songsList);
        setAddedSongIds((prev) => [...prev, song.id]);

        audioEle.removeEventListener("loadedmetadata", upload);
        URL.revokeObjectURL(audioEle.src);
        // setTimeout(async () => {
        // }, 1000);
        resolve();
      };

      audioEle.addEventListener("loadedmetadata", upload);
    });

  }



  // console.log("addedSongIds ", addedSongIds);

  return { tempSongs, setTempSongs, addedSongIds, status, handleInputChange };
}

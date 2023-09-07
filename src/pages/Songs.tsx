import { FC, useEffect, useState } from "react";
import SongListItem from "../components/ui/SongListItem";
import { useDispatch, useSelector } from "react-redux";
import { selectAllSongStore, setSong } from "../store/SongSlice";
import { Song, User } from "../types";
import { useTheme } from "../store/ThemeContext";
import {
  collection,
  doc,
  documentId,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { routes } from "../routes";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircleIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from "../components/ui/Button";
import { useSongs } from "../store/SongsContext";

interface Props {}

const SongsPage: FC<Props> = () => {
  const songStore = useSelector(selectAllSongStore);
  const dispatch = useDispatch();

  const [loggedInUser] = useAuthState(auth);
  const { theme } = useTheme();

  const { song: songInStore } = songStore;
  const { songs } = useSongs();
  const [userSongs, setUserSongs] = useState<Song[]>([]);
  const [tab, setTab] = useState("all");

  const songsCollectionRef = collection(db, "songs");
  const userCollectionRef = collection(db, "users");

  const navigate = useNavigate();

  const handleSetSong = (song: Song, index: number) => {
    dispatch(setSong({ ...song, currentIndex: index }));
  };

  const allSong = [...userSongs, ...songs];

  useEffect(() => {
    //  console.log("useEffect in songs");
    const getSongs = async () => {
      try {
        const userDocRef = doc(
          userCollectionRef,
          loggedInUser?.email as string
        );

        // get user data
        const userSnapShot = await getDoc(userDocRef);
        const userData = userSnapShot.data() as User;

        if (userSnapShot.exists()) {
          if (userData?.songs) {
            // get with condition, use query
            const queryGetUserSongs = query(
              songsCollectionRef,
              where(documentId(), "in", userData.songs)
            );

            // get songs uploaded by user
            const songsSnapshot = await getDocs(queryGetUserSongs);
            const songsList = songsSnapshot.docs?.map((doc) => {
              const songData = doc.data() as Song;
              return { ...songData, id: doc.id };
            });
            setUserSongs(songsList);
          }
        }
      } catch (error) {
        console.log({ message: error });
      }
    };

    getSongs();
  }, []);

  if (!loggedInUser) navigate(routes.home);

  console.log('check user song', userSongs);
  

  return (
    <div className="pb-[30px] ">
      <div className="flex justify-between">
        <h3 className="text-2xl font-bold">All songs</h3>
        <Link className="text-[400] flex" to={routes.upload}>
          <Button
            className={`${theme.content_bg} rounded-full`}
            variant={"primary"}
          >
            <PlusCircleIcon className="w-[20px] mr-[5px]" />
            Upload
          </Button>
        </Link>
      </div>

      <div className="flex mt-[10px] gap-[10px]">
        <Button
          onClick={() => setTab("all")}
          variant={"primary"}
          className={`rounded-full ${
            tab === "all" ? theme.content_bg : "bg-" + theme.alpha
          }`}
        >
          All
        </Button>
        <Button
          onClick={() => setTab("uploaded")}
          variant={"primary"}
          className={`rounded-full ${
            tab === "uploaded" ? theme.content_bg : "bg-" + theme.alpha
          }`}
        >
          Uploaded
        </Button>
      </div>
      <div className="flex flex-row flex-wrap mt-[30px] -mx-[8px]">
        {tab === "uploaded" && (
          <>
            {!!userSongs.length ? (
              <>
                {userSongs.map((song, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full px-[8px] max-[549px]:w-full"
                    >
                      <SongListItem
                        theme={theme}
                        onClick={() => handleSetSong(song, index)}
                        active={song.song_path === songInStore.song_path}
                        key={index}
                        data={song as Song & { id: string }}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <h1 className="pl-[8px]">No song jet...</h1>
            )}
          </>
        )}

        {tab === "all" && (
          <>
            {!!allSong.length ? (
              <>
                {allSong.map((song, index) => {
                  return (
                    <div
                      key={index}
                      className="w-full px-[8px] max-[549px]:w-full"
                    >
                      <SongListItem
                        theme={theme}
                        onClick={() => handleSetSong(song, index)}
                        active={song.song_path === songInStore.song_path}
                        key={index}
                        data={song as Song & { id: string }}
                      />
                    </div>
                  );
                })}
              </>
            ) : (
              <h1 className="pl-[8px]">No song jet...</h1>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SongsPage;

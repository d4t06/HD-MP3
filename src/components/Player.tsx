import {
   FC,
   createContext,
   useCallback,
   useContext,
   useEffect,
   useRef,
   useState,
} from "react";

import BottomPlayer from "./BottomPlayer";
import FullScreenPlayer from "./FullScreenPlayer";
import { useSelector } from "react-redux";
import { selectAllSongStore } from "../store/SongSlice";
import MobileFullScreenPlayer from "./MobileFullScreenPlayer";
import MobileBottomPlayer from "./MobileBottomPlayer";
import { Song } from "../types";
import { useSongsStore } from "../store/SongsContext";

interface ProviderProps {
   children: JSX.Element;
}

interface ActuallySongsContextType {
   actuallySongs: Song[];
}

const initActuallySongs: ActuallySongsContextType = {
   actuallySongs: [],
};

const ActuallySongsContext = createContext<ActuallySongsContextType>(initActuallySongs);

type UseActuallySongsHookType = {
   actuallySongs: ActuallySongsContextType["actuallySongs"];
};

const useActuallySongs = (): UseActuallySongsHookType => {
   const { actuallySongs } = useContext(ActuallySongsContext);
   return { actuallySongs };
};

const ActuallySongsProvider = ({ children }: ProviderProps) => {
   const { userSongs, adminSongs, initial } = useSongsStore();
   const { song: songInStore, playlist: playlistInStore } =
      useSelector(selectAllSongStore);

   const [actuallySongs, setActuallySongList] = useState<Song[]>([]);

   // const prevPlaylist = useRef("");
   // const prevSongIn = useRef('')

   const getActuallySongList = useCallback(() => {
      let i = 0;

      // play in songs list
      if (!songInStore.song_in.includes("playlist")) {
         // console.log("getActuallySongList song_in songs list");
         return;
         switch (songInStore.song_in) {
            case "admin":
               setActuallySongList(adminSongs);
               break;
            // case "admin-playlist-a":
            //    if (i === playlistInStore.song_ids.length) return;

            //    const songs = adminSongs.filter((adminSong) => {
            //       const condition = playlistInStore.song_ids.find(
            //          (songId) => songId === adminSong.id
            //       );
            //       if (condition) i += 1;
            //       return condition;
            //    });
            //    setActuallySongList(songs);
            //    break;

            case "user":
               setActuallySongList(userSongs);
               break;

            // case "user-playlist-b":
            //    const userPlaylistsSongs = userSongs.filter((useSong) => {
            //       if (i === playlistInStore.song_ids.length) return;

            //       const condition = playlistInStore.song_ids.find(
            //          (songId) => songId === useSong.id
            //       );
            //       if (condition) i += 1;
            //       return condition;
            //    });

            //    // console.log('check userPlaylistsSongs', userPlaylistsSongs)
            //    setActuallySongList(userPlaylistsSongs);
            //    break;
            default:
               console.log(new Error("getActuallySongList no case matches"));
         }
         // play in playlist
      }

      // play in playlist
      if (songInStore.song_in.includes("playlist")) {
         
         if (songInStore.song_in.includes("admin")) {
            // admin - playlist
            if (i === playlistInStore.song_ids.length) return;

            const adminPlaylistSongs = adminSongs.filter((adminSong) => {
               const condition = playlistInStore.song_ids.find(
                  (songId) => songId === adminSong.id
               );
               if (condition) i += 1;
               return condition;
            });

            console.log("getActuallySongList song_in user-playlist", adminPlaylistSongs);
            setActuallySongList(adminPlaylistSongs);

            // user playlist
         } else {
            const userPlaylistsSongs = userSongs.filter((useSong) => {
               if (i === playlistInStore.song_ids.length) return;

               const condition = playlistInStore.song_ids.find(
                  (songId) => songId === useSong.id
               );
               if (condition) i += 1;
               return condition;
            });

            console.log("getActuallySongList song_in user-playlist", userPlaylistsSongs);

            setActuallySongList(userPlaylistsSongs);
         }
      }
   }, [songInStore.song_in, playlistInStore.song_ids, userSongs, adminSongs]);

   useEffect(() => {
      if (!initial) return;

      // song in admin, song in user
      // song in a playli  dt, song in b playlist
      // if (prevPlaylist.current != playlistInStore.name
      //    || prevSongIn.current != songInStore.name)
      getActuallySongList();      

      // return () => {
      //    prevPlaylist.current === playlistInStore.name;
      //    prevSongIn.current === songInStore.name
      // };
   }, [songInStore.song_in, playlistInStore.song_ids, initial]);

   return (
      <ActuallySongsContext.Provider value={{ actuallySongs }}>
         {children}
      </ActuallySongsContext.Provider>
   );
};

interface PlayerProps {}

const Player: FC<PlayerProps> = () => {
   const songStore = useSelector(selectAllSongStore);

   const { song: songInStore } = songStore;
   const [isPlaying, setIsPlaying] = useState<boolean>(false);
   const [isWaiting, setIsWaiting] = useState<boolean>(false);
   const [isOpenFullScreen, setIsOpenFullScreen] = useState<boolean>(false);

   const [ishasAudioEle, setIsHasAudioEle] = useState(false);

   const audioRef = useRef<HTMLAudioElement>(null);
   const windowWidth = useRef<number>(window.innerWidth);

   // console.log("check render");

   const desktopContent = (
      <>
         <FullScreenPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <BottomPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isWaiting={isWaiting}
            isOpenFullScreen={isOpenFullScreen}
            setIsPlaying={setIsPlaying}
            setIsWaiting={setIsWaiting}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   const mobileContent = (
      <>
         <MobileFullScreenPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false}
            isPlaying={isPlaying}
            isWaiting={isWaiting}
            isOpenFullScreen={isOpenFullScreen}
            setIsPlaying={setIsPlaying}
            setIsWaiting={setIsWaiting}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />

         <MobileBottomPlayer
            audioEle={audioRef.current as HTMLAudioElement}
            idle={false && isOpenFullScreen}
            isPlaying={isPlaying}
            isOpenFullScreen={isOpenFullScreen}
            isWaiting={isWaiting}
            setIsOpenFullScreen={setIsOpenFullScreen}
         />
      </>
   );

   useEffect(() => {
      if (ishasAudioEle) return;
      if (audioRef.current) setIsHasAudioEle(true);
   }, []);

   // console.log("player render");

   return (
      <ActuallySongsProvider>
         <div className="absolute">
            <audio ref={audioRef} src={songInStore.song_path} className="hidden"></audio>
            {ishasAudioEle
               ? windowWidth.current >= 550
                  ? desktopContent
                  : mobileContent
               : ""}
         </div>
      </ActuallySongsProvider>
   );
};

export default Player;
export { useActuallySongs };

import { useMemo, useState } from "react";
import { useSongListContext } from "../store/SongListContext";
import {
   selectAllSongStore,
   useActuallySongsStore,
   useAuthStore,
   useSongsStore,
   useTheme,
   useUpload,
} from "../store";
import { useInitSong } from "../hooks";
import { useDispatch, useSelector } from "react-redux";
import { SongWithSongIn, setSong } from "../store/SongSlice";
import { SongList } from ".";
import { SongItemSkeleton } from "./skeleton";
import { mySetDoc } from "../utils/firebaseHelpers";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";
import { sleep } from "../utils/appHelpers";
import CheckedBar from "./CheckedBar";
import PlaylistProvider from "../store/PlaylistSongContext";

type Tab = "mine" | "favorite";

const tabs: Array<Tab> = ["mine", "favorite"];

export default function MySongSongsList() {
   const dispatch = useDispatch();

   //   store
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { userSongs } = useSongsStore();
   const { actuallySongs, setActuallySongs } = useActuallySongsStore();
   const { song: songInStore } = useSelector(selectAllSongStore);
   const { selectedSongs, setSelectedSongs, setIsChecked } = useSongListContext();

   //    state
   const [songTab, setSongTab] = useState<Tab>("mine");
   const [favoriteSongs, setFavoriteSongs] = useState<Song[]>([]);
   const [songLoading, setSongLoading] = useState(false);

   // hooks
   // const { setSuccessToast, setErrorToast } = useToast();
   const { loading: initialLoading, errorMsg, initial } = useInitSong({});
   const { tempSongs, addedSongIds } = useUpload();

   const songCount = useMemo(() => {
      if (initialLoading || !initial) return 0;
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs, initial, initialLoading]);

   const favoriteSongsFiltered = useMemo(
      () => (user ? favoriteSongs.filter((s) => user.like_song_ids.includes(s.id)) : []),
      [user?.like_song_ids]
   );

   // const closeModal = () => setIsOpenModal(false);

   const handleSelectAll = () => {
      if (selectedSongs.length < userSongs.length) setSelectedSongs(userSongs);
      else resetCheckedList();
   };

   const resetCheckedList = () => {
      setSelectedSongs([]);
      setIsChecked(false);
   };

   const handleGetFavorite = async () => {
      if (!user) return;
      if (!user.like_song_ids.length) return setFavoriteSongs([]);

      try {
         const queryGetFavorites = query(
            collection(db, "songs"),
            where("id", "in", user.like_song_ids)
         );
         const favoritesSnap = await getDocs(queryGetFavorites);

         let userLikeSongIdsChange = false;
         let userLikeSongIds: string[] = [];

         if (favoritesSnap.docs.length) {
            const favorites = favoritesSnap.docs.map(
               (s) => ({ ...s.data(), song_in: "favorite" } as SongWithSongIn)
            );

            setFavoriteSongs(favorites);
            //   handle update user like_song_ids when song have been remove
            if (favoriteSongs.length < user.like_song_ids.length) {
               const newUserLikeSongIds = favorites.map((s) => s.id);
               userLikeSongIdsChange = true;
               userLikeSongIds = newUserLikeSongIds;
            }
            //   handle update user like_song_ids
         } else if (user.like_song_ids) {
            userLikeSongIdsChange = true;
            userLikeSongIds = [];
         }

         if (userLikeSongIdsChange) {
            await mySetDoc({
               collection: "users",
               data: { like_song_ids: userLikeSongIds } as Partial<User>,
               id: user.email,
               msg: ">>> api: update user like song ids",
            });

            // setUser();

            console.log("get favorite set user info");
         }
      } catch (error) {
         console.log("error");
      } finally {
         setSongLoading(false);
      }
   };

   const handleSetTab = async (name: Tab) => {
      setSongTab(name);
      setSongLoading(true);
      resetCheckedList();
      if (name === "favorite") await handleGetFavorite();
      else {
         await sleep(300);
         setSongLoading(false);
      }
   };

   const handleSetSong = (song: Song, index: number) => {
      console.log(">>> check song in", songInStore.song_in);

      if (songInStore.song_in !== "user") {
         setActuallySongs(userSongs);
         console.log("setActuallySongs");
      }

      // song in playlist and song in user are two difference case
      if (songInStore.id !== song.id || songInStore.song_in !== "user") {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));
      }
   };

   const handleSetFavoriteSong = (song: Song, index: number) => {
      if (songInStore.id !== song.id) {
         dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));

         if (
            songInStore.song_in !== "favorite" ||
            actuallySongs.length !== favoriteSongsFiltered.length
         ) {
            setActuallySongs(favoriteSongsFiltered);
         }
      }
   };

   // const handleDeleteSelectedSong = async () => {
   //    if (!user) return;

   //    let newUserSongs = [...userSongs];
   //    const deletedIds: string[] = [];

   //    try {
   //       setIsFetching(true);
   //       // >>> api
   //       for (let song of selectedSongs) {
   //          await deleteSong(song);

   //          newUserSongs = newUserSongs.filter((s) => s.id !== song.id);
   //          deletedIds.push(song.id);
   //       }
   //       const userSongIds: string[] = newUserSongs.map((song) => song.id);
   //       await setUserSongIdsAndCountDoc({ songIds: userSongIds, user });

   //       // handle song queue
   //       if (songInStore.song_in === "user") {
   //          const newSongQueue = actuallySongs.filter((s) => !deletedIds.includes(s.id));
   //          setActuallySongs(newSongQueue);
   //          console.log("setActuallySongs");
   //       }

   //       // handle song in store
   //       if (deletedIds.includes(songInStore.id)) {
   //          const emptySong = initSongObject({});
   //          dispatch(setSong({ ...emptySong, song_in: "", currentIndex: 0 }));
   //       }

   //       // handle user songs
   //       setUserSongs(newUserSongs);

   //       // >>> finish
   //       setSuccessToast({ message: `${selectedSongs.length} songs deleted` });
   //    } catch (error) {
   //       console.log(error);
   //       setErrorToast({ message: "Error when delete songs" });
   //    } finally {
   //       resetCheckedList();
   //       setIsFetching(false);
   //    }
   // };

   if (errorMsg) return <p>Some thing went wrong</p>;

   return (
      <>
         <CheckedBar selectAll={handleSelectAll} location="my-songs">
            <p className="font-semibold opacity-[.6]">{songCount} Songs</p>
         </CheckedBar>

         {/* tab */}
         <div className={`flex items-center space-x-[10px] my-[10px]`}>
            {tabs.map((tab, index) => {
               const active = songTab === tab;
               return (
                  <button
                     key={index}
                     onClick={() => handleSetTab(tab)}
                     className={`text-[14px] font-[500] px-[10px] 
                        ${theme.content_border} border py-[4px] rounded-[99px] ${
                        active ? theme.content_bg : ""
                     }
                    `}
                  >
                     {tab === "mine" ? "My songs" : "Favorite"}
                  </button>
               );
            })}
         </div>

         {/* song list */}
         <div className="min-h-[50vh]">
            {(initialLoading || songLoading) && SongItemSkeleton}

            {!initialLoading && !songLoading && (
               <>
                  {songTab === "mine" && !!songCount && (
                     <SongList
                        handleSetSong={handleSetSong}
                        activeExtend={
                           songInStore.song_in === "user" ||
                           songInStore.song_in === "favorite"
                        }
                        songs={userSongs}
                        tempSongs={tempSongs}
                        addedSongIds={addedSongIds}
                     />
                  )}

                  {songTab === "favorite" && !!favoriteSongsFiltered.length && (
                     <SongList
                        activeExtend={
                           songInStore.song_in === "user" ||
                           songInStore.song_in === "favorite"
                        }
                        handleSetSong={handleSetFavoriteSong}
                        songs={favoriteSongsFiltered}
                     />
                  )}
               </>
            )}
         </div>
      </>
   );
}

import { useMemo, useState } from "react";
import { useAuthStore, useSongsStore, useTheme, useUpload } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { SongList } from ".";
import Skeleton, { SongItemSkeleton } from "./skeleton";
import { sleep } from "../utils/appHelpers";
import CheckedBar from "./CheckedBar";
import { selectCurrentSong, setSong } from "@/store/currentSongSlice";
import { selectSongQueue, setQueue } from "@/store/songQueueSlice";

type Tab = "mine" | "favorite";

const tabs: Array<Tab> = ["mine", "favorite"];

type Props = {
   initialLoading: boolean;
};

export default function MySongSongsList({ initialLoading }: Props) {
   const dispatch = useDispatch();

   //   store
   const { theme } = useTheme();
   const { user } = useAuthStore();
   const { userSongs } = useSongsStore();
   const { currentSong } = useSelector(selectCurrentSong);
   const { from, queueSongs } = useSelector(selectSongQueue);

   //    state
   const [songTab, setSongTab] = useState<Tab>("mine");
   // const [favoriteSongs, setFavoriteSongs] = useState<SongWithSongIn[]>([]);
   const [songLoading, setSongLoading] = useState(false);

   // hooks
   const { tempSongs } = useUpload();

   const songCount = useMemo(() => {
      if (initialLoading) return 0;
      return tempSongs.length + userSongs.length;
   }, [tempSongs, userSongs, initialLoading]);

   // const favoriteSongsFiltered = useMemo(
   //    () => (user ? favoriteSongs.filter((s) => user.like_song_ids.includes(s.id)) : []),
   //    [user?.like_song_ids]
   // );

   // const resetCheckedList = () => {
   //    setSelectedSongs([]);
   //    setIsChecked(false);
   // };

   const handleGetFavorite = async () => {
      if (!user) return;
      // if (!user.like_song_ids.length) return setFavoriteSongs([]);
      // setFavoriteSongs([]);
      await sleep(300);

      return setSongLoading(false);

      // try {
      //    const queryGetFavorites = query(
      //       collection(db, "songs"),
      //       where("id", "in", user.like_song_ids)
      //    );
      //    const favoritesSnap = await getDocs(queryGetFavorites);

      //    let userLikeSongIdsChange = false;
      //    let userLikeSongIds: string[] = [];

      //    if (favoritesSnap.docs.length) {
      //       const favorites = favoritesSnap.docs.map(
      //          (s) => ({ ...s.data(), song_in: "favorite" } as SongWithSongIn)
      //       );

      //       setFavoriteSongs(favorites);
      //       //   handle update user like_song_ids when song have been remove
      //       if (favoriteSongs.length < user.like_song_ids.length) {
      //          const newUserLikeSongIds = favorites.map((s) => s.id);
      //          userLikeSongIdsChange = true;
      //          userLikeSongIds = newUserLikeSongIds;
      //       }
      //       //   handle update user like_song_ids
      //    } else if (user.like_song_ids) {
      //       userLikeSongIdsChange = true;
      //       userLikeSongIds = [];
      //    }

      //    if (userLikeSongIdsChange) {
      //       await mySetDoc({
      //          collection: "users",
      //          data: { like_song_ids: userLikeSongIds } as Partial<User>,
      //          id: user.email,
      //          msg: ">>> api: update user like song ids",
      //       });

      //       // setUser();

      //       // console.log("get favorite set user info");
      //    }
      // } catch (error) {
      //    console.log("error");
      // } finally {
      //    setSongLoading(false);
      // }
   };

   const handleSetTab = async (name: Tab) => {
      setSongTab(name);
      setSongLoading(true);
      // resetCheckedList();
      if (name === "favorite") await handleGetFavorite();
      else {
         await sleep(300);
         setSongLoading(false);
      }
   };

   const handleSetSong = (song: Song, index: number) => {
      const isSetQueue =
         from.length > 1 ||
         userSongs.length !== queueSongs.length ||
         from[0] != "user";
      if (isSetQueue) dispatch(setQueue({ songs: userSongs }));

      // song in playlist and song in user are two difference case
      if (currentSong?.id !== song.id || currentSong?.song_in !== "user") {
         dispatch(
            setSong({ ...(song as SongWithSongIn), currentIndex: index })
         );
      }
   };

   // const handleSetFavoriteSong = (song: Song, index: number) => {
   //    if (currentSong.id !== song.id) {
   //       dispatch(setSong({ ...(song as SongWithSongIn), currentIndex: index }));

   //       if (
   //          currentSong.song_in !== "favorite" ||
   //          queueSongs.length !== favoriteSongsFiltered.length
   //       ) {
   //          dispatch(setQueue({ songs: favoriteSongsFiltered }));
   //       }
   //    }
   // };

   return (
      <>
         <CheckedBar variant="my-songs">
            {initialLoading ? (
               <>
                  <div className="h-[30px] mb-[10px] flex items-center">
                     <Skeleton className="h-[20px] w-[90px]" />
                  </div>
               </>
            ) : (
               <p className="font-[500] opacity-[.5]">{songCount} Songs</p>
            )}
         </CheckedBar>

         {/* tab */}
         <div className={`flex items-center space-x-[10px] py-[10px]`}>
            {tabs.map((tab, index) => {
               const active = songTab === tab;
               return (
                  <button
                     key={index}
                     onClick={() => handleSetTab(tab)}
                     className={`text-[14px] font-[500] px-[10px] 
                        ${
                           theme.content_border
                        } border py-[4px] rounded-[99px] ${
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
                     <>
                        <SongList
                           variant="my-songs"
                           handleSetSong={handleSetSong}
                           activeExtend={
                              currentSong?.song_in === "user" ||
                              currentSong?.song_in === "favorite"
                           }
                           songs={userSongs}
                           tempSongs={tempSongs}
                        />
                        <SongList songs={tempSongs} variant="uploading" />
                     </>
                  )}

                  {songTab === "favorite" && (
                     <img
                        className="mx-auto my-5"
                        src="https://d4t06.github.io/Vue-Mobile/assets/search-empty-ChRLxitn.png"
                        alt=""
                     />
                  )}
               </>
            )}
         </div>
      </>
   );
}

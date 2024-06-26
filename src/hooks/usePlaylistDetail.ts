// import { PlaylistParamsType } from "../routes";

import { useState } from "react";

// import { useNavigate, useParams } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";

// import { useInitSong } from "../hooks";

// import { db } from "../config/firebase";
// import { sleep } from "../utils/appHelpers";
// import { myGetDoc, mySetDoc } from "../utils/firebaseHelpers";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { useAuthStore, useSongsStore, useToast } from "../store";
// import appConfig from "../config/app";
import useGetPlaylist from "./useGetPlaylist";
// import { selectCurrentSong } from "@/store/currentSongSlice";
// import { selectCurrentPlaylist } from "@/store/currentPlaylistSlice";

// type Props = {
// currentPlaylist: Playlist;
// songInStore: Song & Status;
// firstTimeRender: MutableRefObject<boolean>;
// admin?: boolean;
// };

export default function usePlaylistDetail() {
   // use store
   // const dispatch = useDispatch();
   // const { loading: userLoq35]ading} = useAuthStore();
   // const { setErrorToast } = useToast();
   // const { currentSong } = useSelector(selectCurrentSong);
   // const { currentPlaylist } = useSelector(selectCurrentPlaylist);

   // const { errorMsg, initial } = useInitSong({ admin });
   // const { adminSongs, userSongs } = useSongsStore();

   // state
   // const [isFetching, setIsFetching] = useState(true);
   const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
   // const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
   // const firstTimeRun = useRef(true);

   // use hook
   // const params = useParams<PlaylistParamsType>();
   // const navigate = useNavigate();
   const { isFetching: initFetching } = useGetPlaylist();

   // const getAndSetPlaylist = async () => {
   //    if (!params.id) throw new Error();

   //    try {
   //       console.log(">>> api get playlist");

   //       setIsFetching(true);

   //       const playlistSnap = await myGetDoc({
   //          collection: "playlist",
   //          id: params.id,
   //          msg: "Get playlist doc",
   //       });

   //       if (playlistSnap.exists()) {
   //          const playlist = playlistSnap.data() as Playlist;

   //          dispatch(setPlaylist(playlist));
   //       } else navigate("/");
   //    } catch (error) {
   //       console.log({ message: error });
   //       setErrorToast({});
   //       navigate("/");
   //    } finally {
   //       setIsFetching(false);
   //    }
   // };

   // const handlePlaylistWhenSongsModified = async (songs: Song[]) => {
   //    console.log(">>> handle playlist, song modified");
   //    const newPlaylist = generatePlaylistAfterChangeSongs({
   //       songs,
   //       existingPlaylist: currentPlaylist,
   //    });

   //    await mySetDoc({
   //       collection: "playlist",
   //       data: newPlaylist,
   //       id: currentPlaylist.id,
   //       msg: ">>> api: update playlist doc",
   //    });

   // };

   // const getPlaylistSongs = useCallback(async () => {
   //    console.log(">>> api: get playlist songs");

   //    setLoading(true);
   //    const songsRef = collection(db, "songs");

   //    const queryGetSongs = query(songsRef, where("id", "in", currentPlaylist.song_ids));
   //    const songsSnap = await getDocs(queryGetSongs);

   //    if (songsSnap.docs) {
   //       const songs = songsSnap.docs.map(
   //          (doc) =>
   //             ({ ...doc.data(), song_in: `playlist_${currentPlaylist.id}` } as Song & {
   //                song_in: string;
   //             })
   //       );
   //       setPlaylistSongs(songs);

   //       // case actually song length do not match with data
   //       // because song have been deleted
   //       if (songs.length != currentPlaylist.song_ids.length) {
   //          console.log(">>> handle playlist, song modified");
   //          await handlePlaylistWhenSongsModified(songs);
   //       }

   //       // case user add song to playlist song item
   //       if (
   //          songInStore.song_in === `playlist_${currentPlaylist.id}` &&
   //          actuallySongs.length < songs.length
   //       ) {
   //          setActuallySongs(songs);
   //          console.log("set actually songs");
   //       }

   //       // finish
   //       await sleep(appConfig.loadingDuration);
   //       setLoading(false);
   //    }
   // }, [currentPlaylist.song_ids, userSongs, adminSongs, playlistSongs]);

   // const handleGetPlaylistImage = async () => {
   //    const firstSongHasImage = playlistSongs.find((song) => song.image_url);
   //    if (!firstSongHasImage) return;

   //    // case both images  same
   //    if (
   //       currentPlaylist.image_url &&
   //       currentPlaylist.image_url === firstSongHasImage.image_url
   //    )
   //       return;

   //    const newPlaylist: Playlist = {
   //       ...currentPlaylist,
   //       image_url: firstSongHasImage.image_url,
   //       blurhash_encode: firstSongHasImage.blurhash_encode || "",
   //    };

   //    await mySetDoc({
   //       collection: "playlist",
   //       id: currentPlaylist.id,
   //       data: newPlaylist,
   //       msg: ">>> api: update image_url playlist doc",
   //    });

   //    dispatch(updatePlaylist({ image_url: firstSongHasImage.image_url }));
   // };

   // const handleUpdateActuallySongs = () => {
   //    const isPlayingPlaylist = songInStore.song_in.includes(currentPlaylist.name);
   //    if (!isPlayingPlaylist) {
   //       return;
   //    }
   //    setActuallySongs(playlistSongs);
   //    console.log("setActuallySongs");
   // };

   // useEffect(() => {
   //    if (admin && !initial) navigate("/dashboard");
   // }, []);

   // get playlist after initial
   // useEffect(() => {
   //    if (!initial || errorMsg) return;

   //    // if (firstTimeRun.current) {
   //    //    firstTimeRun.current = false;

   //    if (currentPlaylist.id === params.id) {
   //       console.log("Already have playlist");

   //       // getPlaylistSongs();
   //       setSomeThingToTrigger(Math.random());
   //       return;
   //    }

   //    getAndSetPlaylist();
   //    // }
   // }, [initial]);

   // get playlist songs
   // useEffect(() => {
   //    if (getPlaylistFetching) return;

   //    // case playlist no have songs
   //    if (!currentPlaylist.song_ids.length) {
   //       setTimeout(() => {
   //          setLoading(false);
   //       }, appConfig.loadingDuration);
   //       return;
   //    }

   //    if (!!playlistSongs.length) return;

   //    console.log("call get playlist songs");

   //    getPlaylistSongs();
   // }, [currentPlaylist.song_ids]);

   // for update playlist feature image
   // useEffect(() => {
   //    if (!playlistSongs.length) return;

   //    handleGetPlaylistImage();
   // }, [playlistSongs]);

   // for actually song after user add or remove song from playlist
   // only run when after play song in playlist then playlist songs change
   // useEffect(() => {
   //    if (playlistSongs.length) handleUpdateActuallySongs();
   // }, [playlistSongs]);

   return { playlistSongs, loading: initFetching, setPlaylistSongs };
}

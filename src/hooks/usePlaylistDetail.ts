import { Playlist, Song } from "../types";
import { PlaylistParamsType } from "../routes";

import { useEffect, useState, MutableRefObject, useCallback, useRef } from "react";

import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useSongs } from "../hooks";

import { db } from "../config/firebase";
import { Status } from "../store/SongSlice";
import { generatePlaylistAfterChangeSongs, sleep } from "../utils/appHelpers";
import { myGetDoc, mySetDoc } from "../utils/firebaseHelpers";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
   useAuthStore,
   useSongsStore,
   selectAllSongStore,
   setPlaylist,
   useActuallySongs,
   useToast,
} from "../store";
import appConfig from "../config/app";

type Props = {
   playlistInStore: Playlist;
   songInStore: Song & Status;
   firstTimeRender: MutableRefObject<boolean>;
   admin?: boolean;
};

export default function usePlaylistDetail({ admin }: Props) {
   // use store
   const dispatch = useDispatch();
   const { userInfo } = useAuthStore();
   const { setErrorToast } = useToast();
   const { setActuallySongs, actuallySongs } = useActuallySongs();
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);
   const { errorMsg, initial } = useSongs({ admin });
   const { adminSongs, userSongs } = useSongsStore();

   // state
   const [loading, setLoading] = useState(true);
   const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
   const [someThingToTrigger, setSomeThingToTrigger] = useState(0);
   const firstTimeRun = useRef(true);

   // use hook
   const params = useParams<PlaylistParamsType>();
   const navigate = useNavigate();

   // set playlist slice
   const getAndSetPlaylist = useCallback(async () => {
      if (!params.id) throw new Error();

      try {
         let playlist;
         const playlistData = await myGetDoc({
            collection: "playlist",
            id: params.id,
            msg: "Get playlist doc",
         });

         if (playlistData.exists()) {
            playlist = playlistData.data() as Playlist;

            console.log(">>> local: set playlist");
            dispatch(setPlaylist(playlist));
            setSomeThingToTrigger(Math.random());
         } else {
            console.log("Playlist not found");

            if (admin) navigate("/dashboard");
            else navigate("/");
         }
      } catch (error) {
         console.log(error);
         setErrorToast({ message: "Error when get playlist" });
      }
   }, [params, userInfo]);

   const handlePlaylistWhenSongsModified = async (songs: Song[]) => {
      console.log(">>> handle playlist, song modified");
      const newPlaylist = generatePlaylistAfterChangeSongs({
         songs,
         existingPlaylist: playlistInStore,
      });

      await mySetDoc({
         collection: "playlist",
         data: newPlaylist,
         id: playlistInStore.id,
         msg: ">>> api: update playlist doc",
      });

      dispatch(setPlaylist(newPlaylist));
   };

   const getPlaylistSongs = useCallback(async () => {
      console.log(">>> api: get playlist songs");

      setLoading(true);
      const songsRef = collection(db, "songs");

      const queryGetSongs = query(songsRef, where("id", "in", playlistInStore.song_ids));
      const songsSnap = await getDocs(queryGetSongs);

      if (songsSnap.docs) {
         const songs = songsSnap.docs.map(
            (doc) =>
               ({ ...doc.data(), song_in: playlistInStore.id } as Song & {
                  song_in: string;
               })
         );
         setPlaylistSongs(songs);

         // case actually song length do not match with data
         // because song have been deleted
         if (songs.length != playlistInStore.song_ids.length) {
            console.log(">>> handle playlist, song modified");
            await handlePlaylistWhenSongsModified(songs);
         }

         // case user add song to playlist song item
         if (
            songInStore.song_in === `playlist_${playlistInStore.id}` &&
            actuallySongs.length < songs.length
         ) {
            setActuallySongs(songs);
            console.log("set actually songs");
         }

         // finish
         await sleep(appConfig.loadingDuration);
         setLoading(false);
      }
   }, [playlistInStore.song_ids, userSongs, adminSongs, playlistSongs]);

   const handleGetPlaylistImage = async () => {
      const firstSongHasImage = playlistSongs.find((song) => song.image_url);
      if (!firstSongHasImage) return;

      // case both images  same
      if (playlistInStore.image_url && playlistInStore.image_url === firstSongHasImage.image_url)
         return;

      const newPlaylist: Playlist = {
         ...playlistInStore,
         image_url: firstSongHasImage.image_url,
         blurhash_encode: firstSongHasImage.blurhash_encode || "",
      };

      await mySetDoc({
         collection: "playlist",
         id: playlistInStore.id,
         data: newPlaylist,
         msg: ">>> api: update image_url playlist doc",
      });
   };

   const handleUpdateActuallySongs = () => {
      const isPlayingPlaylist = songInStore.song_in.includes(playlistInStore.name);
      if (!isPlayingPlaylist) {
         return;
      }
      setActuallySongs(playlistSongs);
      console.log("setActuallySongs");
   };

   useEffect(() => {
      if (admin && !initial) navigate("/dashboard");
   }, []);

   // get playlist after initial
   useEffect(() => {
      if (!initial || errorMsg) return;

      if (firstTimeRun.current) {
         firstTimeRun.current = false;

         if (playlistInStore.id === params.id) {
            console.log("Already have playlist");
            // getPlaylistSongs();
            setSomeThingToTrigger(Math.random());
            return;
         }

         getAndSetPlaylist();
      }
   }, [initial]);

   // get playlist songs
   useEffect(() => {
      if (!someThingToTrigger || errorMsg) return;

      // case playlist no have songs
      if (!playlistInStore.song_ids.length) {
         setTimeout(() => {
            setLoading(false);
         }, appConfig.loadingDuration);
         return;
      }

      getPlaylistSongs();
   }, [someThingToTrigger]);

   // for update playlist feature image
   useEffect(() => {
      if (!initial) return;
      if (!playlistSongs.length) return;

      handleGetPlaylistImage();
   }, [playlistSongs]);

   // for actually song after user add or remove song from playlist
   // only run when after play song in playlist then playlist songs change
   useEffect(() => {
      if (admin) return;

      if (playlistSongs.length) handleUpdateActuallySongs();
   }, [playlistSongs]);

   return { playlistSongs, loading, setPlaylistSongs };
}

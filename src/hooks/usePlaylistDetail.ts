import { Playlist, Song } from "../types";
import { useEffect, useState, MutableRefObject, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useToast } from "../store/ToastContext";
import { Status, selectAllSongStore, setPlaylist } from "../store/SongSlice";
import { useSongsStore } from "../store/SongsContext";

import { generateId, updatePlaylistsValue } from "../utils/appHelpers";
import useSong from "./useSongs";
import { mySetDoc } from "../utils/firebaseHelpers";
import { useActuallySongs } from "../store/ActuallySongsContext";

type Props = {
   playlistInStore: Playlist;
   songInStore: Song & Status;
   firstTimeRender: MutableRefObject<boolean>;
};

export default function usePlaylistDetail({
   firstTimeRender,
}: // playlistInStore,
Props) {
   // use store
   const dispatch = useDispatch();
   const { setErrorToast } = useToast();

   const params = useParams();
   const { setActuallySongs } = useActuallySongs();
   const { song: songInStore, playlist: playlistInStore } = useSelector(selectAllSongStore);
   const { loading: useSongLoading, errorMsg: useSongErrorMsg, initial } = useSong();
   const { userData, adminSongs, userSongs, userPlaylists, setUserPlaylists } = useSongsStore();

   // hook state
   const [loading, setLoading] = useState(useSongLoading);
   const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
   const [errorMsg, setErrorMsg] = useState("");
   const firstRunGetPlaylistSongs = useRef(true);

   const getAndSetPlaylist = useCallback(async () => {
      if (!userData.email || !params.name) return;
      const playlistId = generateId(params.name as string, userData.email);
      const playList = userPlaylists.find((playlist) => playlist.id === playlistId);

      if (playList) {
         console.log("set playlist after init");
         dispatch(setPlaylist(playList));
         setLoading(false);
      } else {
         setErrorMsg("No playlist found");
         setErrorToast({ message: "No playlist found" });
      }
   }, [params, userData]);

   const getPlaylistSongs = useCallback(() => {
      let playlistSongs: Song[] = [];
      let targetSongs: Song[];

      if (!playlistInStore.song_ids.length) {
         setPlaylistSongs([]);
         return;
      }

      switch (playlistInStore.by) {
         case "admin":
            targetSongs = adminSongs;
            break;
         default:
            targetSongs = userSongs;
      }

      playlistInStore.song_ids.forEach((songId) => {
         const song = targetSongs.find((song) => song.id === songId);
         if (song) {
            playlistSongs.push(song);
         }
      });

      console.log("get playlist songs", playlistSongs.map(s => s.name));
      setPlaylistSongs(playlistSongs);
   }, [playlistInStore.song_ids, userSongs]);

   // get playlist after initial
   useEffect(() => {
      // console.log("useEffect 1");

      if (firstTimeRender.current) return;

      if (!initial || useSongErrorMsg) return;

      if (playlistInStore.name) {
         setLoading(false);
         return;
      }

      getAndSetPlaylist();
   }, [initial]);

   // get playlist songs, run after get playlist
   useEffect(() => {
      // console.log("useEffect 2");

      if (firstTimeRender.current) return;

      if (!playlistInStore.name || useSongErrorMsg) return;

      getPlaylistSongs();
   }, [playlistInStore.song_ids]);

   // for update playlist feature image
   // useEffect(() => {
   //    if (firstTimeRender.current) return;

   //    if (!initial) return;

   //    if (!playlistSongs.length) return;

   //    const firstSongHasImage = playlistSongs.find((song) => song.image_url);

   //    if (
   //       !firstSongHasImage ||
   //       (playlistInStore.image_url && playlistInStore.image_url === firstSongHasImage.image_url)
   //    )
   //       return;

   //    console.log("get playlist feature image");

   //    const newPlaylist: Playlist = {
   //       ...playlistInStore,
   //       image_url: firstSongHasImage.image_url,
   //    };

   //    const setPlaylistImageToDoc = async () => {
   //       try {
   //          await mySetDoc({
   //             collection: "playlist",
   //             id: playlistInStore.id,
   //             data: newPlaylist,
   //          });
   //       } catch (error) {
   //          console.log("error when set playlist image");
   //          setErrorToast({});
   //       }
   //    };

   //    setPlaylistImageToDoc();
   //    // get new user playlist
   //    const newUserPlaylists = [...userPlaylists];
   //    updatePlaylistsValue(newPlaylist, newUserPlaylists);

   //    // update playlistInStore first
   //    // because the user can be in playlist detail page
   //    dispatch(setPlaylist(newPlaylist));

   //    // update users playlist to context
   //    setUserPlaylists(newUserPlaylists, []);
   // }, [playlistSongs]);

   // for actually song after user add or remove song from playlist
   // only run when after play song in playlist then playlist songs change
   useEffect(() => {
      console.log("useEffevct 3");

      if (firstTimeRender.current) {
         firstTimeRender.current = false;
         return;
      }

      if (!initial) return;

      console.log("check firstRunGetSongs", firstRunGetPlaylistSongs.current);
      if (firstRunGetPlaylistSongs.current) {
         firstRunGetPlaylistSongs.current = false;
         return;
      }

      if (!songInStore.song_in.includes(playlistInStore.name)) return;


      console.log("set actually song 2");

      setActuallySongs(playlistSongs);
   }, [playlistSongs]);

   return { playlistSongs, loading, errorMsg };
}

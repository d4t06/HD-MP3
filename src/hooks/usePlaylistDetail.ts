import { useEffect } from "react";
import useGetPlaylist from "./useGetPlaylist";
import { mySetDoc } from "@/utils/firebaseHelpers";
import { useDispatch, useSelector } from "react-redux";
import {
   selectCurrentPlaylist,
   updateCurrentPlaylist,
} from "@/store/currentPlaylistSlice";

export default function usePlaylistDetail() {
   // use store
   const dispatch = useDispatch();
   const { currentPlaylist } = useSelector(selectCurrentPlaylist);

   // use hook
   const { isFetching, playlistSongs } = useGetPlaylist();

   const handleGetPlaylistImage = async () => {
      const firstSongHasImage = playlistSongs.find((song) => song.image_url);
      if (!firstSongHasImage) return;

      // case both images are same
      if (
         currentPlaylist.image_url &&
         currentPlaylist.image_url === firstSongHasImage.image_url
      )
         return;

      const newPlaylist: Playlist = {
         ...currentPlaylist,
         image_url: firstSongHasImage.image_url,
         blurhash_encode: firstSongHasImage.blurhash_encode || "",
      };

      await mySetDoc({
         collection: "playlist",
         id: currentPlaylist.id,
         data: newPlaylist,
         msg: ">>> api: update playlist doc",
      });

      dispatch(updateCurrentPlaylist({ image_url: firstSongHasImage.image_url }));
   };

   const checkPlaylistSongs = async () => {
      console.log(currentPlaylist.song_ids.length, playlistSongs.length);

      // handle playlist image
      if (!currentPlaylist.song_ids.length) {
         if (currentPlaylist.image_url) {
            const newPlaylist = {
               ...currentPlaylist,
               image_url: "",
               blurhash_encode: "",
            } as Playlist;

            await mySetDoc({
               collection: "playlist",
               id: currentPlaylist.id,
               data: newPlaylist,
               msg: ">>> api: update playlist doc",
            });
         }

         dispatch(updateCurrentPlaylist({ image_url: "", blurhash_encode: "" }));
         return;
      }

      if (currentPlaylist.song_ids.length === playlistSongs.length) return;

      const newPlaylistSongIDs = playlistSongs.map((s) => s.id);
      const newPlaylist = {
         ...currentPlaylist,
         song_ids: newPlaylistSongIDs,
      } as Playlist;

      await mySetDoc({
         collection: "playlist",
         id: currentPlaylist.id,
         data: newPlaylist,
         msg: ">>> api: update playlist doc",
      });

      dispatch(updateCurrentPlaylist({ song_ids: newPlaylistSongIDs }));
   };

   useEffect(() => {
      if (isFetching) return;
      if (!playlistSongs.length || !currentPlaylist) return;

      handleGetPlaylistImage();
   }, [playlistSongs]);

   useEffect(() => {
      if (isFetching) return;
      if (!currentPlaylist) return;

      checkPlaylistSongs();
   }, [isFetching]);

   return { playlistSongs, loading: isFetching };
}

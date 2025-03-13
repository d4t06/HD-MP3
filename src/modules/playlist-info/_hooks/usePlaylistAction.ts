import { useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import { deleteFile, myUpdateDoc } from "@/services/firebaseService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { optimizeAndGetHashImage } from "@/services/appService";
import { doc, writeBatch } from "firebase/firestore";
import { db } from "@/firebase";

export default function usePlaylistAction() {
  // stores
  const dispatch = useDispatch();
  const { user, updateUserData } = useAuthContext();
  const { setPlaylists, playlists } = useSongContext();

  // state
  const [isFetching, setIsFetching] = useState(false);

  // hooks
  const { setSuccessToast, setErrorToast } = useToastContext();
  const navigate = useNavigate();

  type EditPlaylist = {
    variant: "edit";
    data: Partial<Playlist>;
    imageFile?: File;
    playlist: Playlist;
  };

  type LikePlaylist = {
    variant: "like";
    playlist: Playlist;
  };

  type DeletePlaylist = {
    variant: "delete";
    playlist: Playlist;
  };

  const action = async (props: LikePlaylist | EditPlaylist | DeletePlaylist) => {
    try {
      if (!user) throw new Error("user not found");

      setIsFetching(true);
      const batch = writeBatch(db);

      const userRef = doc(db, "Users", user.email);
      const playlistRef = doc(db, "Playlists", props.playlist.id);

      switch (props.variant) {
        case "like": {
          if (!user) throw Error();

          const newLikedPlaylistIds = [...user.liked_playlist_ids];
          const index = newLikedPlaylistIds.findIndex((id) => id === props.playlist.id);

          const isLike = index === -1;

          if (isLike) newLikedPlaylistIds.unshift(props.playlist.id);
          else newLikedPlaylistIds.splice(index, 1);

          const newUserData: Partial<User> = {
            liked_playlist_ids: newLikedPlaylistIds,
          };

          batch.update(userRef, newUserData);

          batch.commit();

          // should fetch new data or update data local ?
          if (isLike) setPlaylists((prev) => [props.playlist, ...prev]);
          else setPlaylists((prev) => prev.filter((p) => p.id !== props.playlist.id));

          updateUserData(newUserData);

          break;
        }
        case "edit": {
          const { data, playlist, imageFile } = props;

          const newPlaylist = { ...playlist, ...data };

          if (imageFile) {
            const imageData = await optimizeAndGetHashImage(imageFile);

            if (playlist.image_file_path)
              await deleteFile({ filePath: playlist.image_file_path });

            Object.assign(newPlaylist, imageData);
          }

          await myUpdateDoc({
            collectionName: "Playlists",
            data: newPlaylist,
            id: playlist.id,
            msg: ">>> api: update playlist doc",
          });

          const newPlaylists = [...playlists];
          const index = newPlaylists.findIndex((p) => p.id === playlist.id);

          if (index !== -1) {
            newPlaylists[index] = newPlaylist;
            setPlaylists(newPlaylists);
          }

          dispatch(updateCurrentPlaylist(newPlaylist));
          setSuccessToast("Playlist edited");

          break;
        }

        case "delete": {
          const { playlist } = props;

          batch.delete(playlistRef);

          if (playlist.image_file_path)
            await deleteFile({ filePath: playlist.image_file_path });

          const newUserData: Partial<User> = {
            liked_playlist_ids: user.liked_playlist_ids.filter(
              (id) => id !== playlist.id
            ),
          };

          batch.update(userRef, newUserData);

          batch.commit();

          const newPlaylists = playlists.filter((p) => p.id !== playlist.id);
          setPlaylists(newPlaylists);

          updateUserData(newUserData);

          navigate("/my-music");
          break;
        }
      }
    } catch (err) {
      console.log({ message: err });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  //   const removeSelectSongs = async (
  //     selectedSongs: Song[],
  //     _setIsFetching?: (v: boolean) => void
  //   ) => {
  //     try {
  //       if (!currentPlaylist || !playlistSongs.length) return;

  //       _setIsFetching ? _setIsFetching(true) : setIsFetching(true);

  //       const selectedSongIds = selectedSongs.map((s) => s.id);
  //       const newPlaylistSongs = [...playlistSongs].filter(
  //         (s) => !selectedSongIds.includes(s.id)
  //       );
  //       const newSongIds = newPlaylistSongs.map((s) => s.id);

  //       await myAddDoc({
  //         collectionName: "Playlists",
  //         data: { song_ids: newSongIds } as Partial<Playlist>,
  //         msg: ">>> api: update playlist doc",
  //       });

  //       dispatch(setPlaylistSong(newPlaylistSongs));

  //       setIsFetching(false);
  //       setSuccessToast(`${selectedSongs.length} songs removed`);

  //       return newPlaylistSongs;
  //     } catch (error) {
  //       setErrorToast();
  //       console.log({ message: error });
  //     } finally {
  //       _setIsFetching ? _setIsFetching(false) : setIsFetching(false);
  //     }
  //   };

  return {
    isFetching,
    action,
    user,
  };
}

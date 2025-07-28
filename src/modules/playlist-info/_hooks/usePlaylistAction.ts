import { useState } from "react";
import { useAuthContext, useSongContext, useToastContext } from "@/stores";
import {
  commentCollectionRef,
  deleteFile,
  myUpdateDoc,
} from "@/services/firebaseService";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { optimizeAndGetHashImage } from "@/services/appService";
import {
  doc,
  getDocs,
  increment,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
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

  const action = async (
    props: LikePlaylist | EditPlaylist | DeletePlaylist,
  ) => {
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
          const index = newLikedPlaylistIds.findIndex(
            (id) => id === props.playlist.id,
          );

          const isLike = index === -1;

          if (isLike) newLikedPlaylistIds.unshift(props.playlist.id);
          else newLikedPlaylistIds.splice(index, 1);

          const newUserData: Partial<User> = {
            liked_playlist_ids: newLikedPlaylistIds,
          };

          const newPlaylistData = {
            like: increment(isLike ? 1 : -1),
          };

          batch.update(userRef, newUserData);
          batch.update(playlistRef, newPlaylistData);

          await batch.commit();

          // should fetch new data or update data local ?
          if (isLike) setPlaylists((prev) => [props.playlist, ...prev]);
          else
            setPlaylists((prev) =>
              prev.filter((p) => p.id !== props.playlist.id),
            );

          updateUserData(newUserData);

          break;
        }
        case "edit": {
          const { data, playlist, imageFile } = props;

          const newPlaylist = { ...playlist, ...data };

          if (imageFile) {
            const imageData = await optimizeAndGetHashImage({ imageFile });

            if (playlist.image_file_id)
              deleteFile({ fileId: playlist.image_file_id });

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

          // eliminate updated_at field otherwise cause error
          // or get new doc of playlist
          // but no worry here because update time don't show on own user playlist screen
          const { updated_at, ...rest } = newPlaylist;

          dispatch(updateCurrentPlaylist(rest));
          setSuccessToast("Playlist edited");

          break;
        }

        case "delete": {
          const { playlist } = props;

          const commentSnap = await getDocs(
            query(commentCollectionRef, where("target_id", "==", playlist.id)),
          );

          const newUserData: Partial<User> = {
            liked_playlist_ids: user.liked_playlist_ids.filter(
              (id) => id !== playlist.id,
            ),
          };

          // delete playlist doc
          batch.delete(playlistRef);

          // update user doc
          batch.update(userRef, newUserData);

          // delete comments doc
          if (!commentSnap.empty) {
            console.log(`Delete ${commentSnap.docs.length} comments`);
            commentSnap.forEach((snap) => batch.delete(snap.ref));
          }

          await Promise.all([
            batch.commit(),
            playlist.image_file_id
              ? deleteFile({ fileId: playlist.image_file_id })
              : () => {},
          ]);

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

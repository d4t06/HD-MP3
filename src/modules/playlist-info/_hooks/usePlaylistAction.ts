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
  const {
    setFavoritePlaylists,
    ownPlaylists,
    favoritePlaylists,
    setOwnPlaylists,
    shouldFetchFavoritePlaylists,
  } = useSongContext();

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

      const isInLikeList = user.liked_playlist_ids.includes(props.playlist.id);

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
          if (isLike) setFavoritePlaylists((prev) => [props.playlist, ...prev]);
          else
            setFavoritePlaylists((prev) =>
              prev.filter((p) => p.id !== props.playlist.id),
            );

          if (isLike) setSuccessToast("Liked");
          else setSuccessToast("Disliked");

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

          const newPlaylists = [...ownPlaylists];
          const index = newPlaylists.findIndex((p) => p.id === playlist.id);

          if (index !== -1) {
            newPlaylists[index] = newPlaylist;
            setOwnPlaylists(newPlaylists);

            if (isInLikeList) {
              shouldFetchFavoritePlaylists.current = true;

              // const newFavoritePlaylists = [...favoritePlaylists];
              // const index = newFavoritePlaylists.findIndex(
              //   (p) => p.id === playlist.id,
              // );

              // newFavoritePlaylists[index] = newPlaylist;
              // setFavoritePlaylists(newFavoritePlaylists);
            }
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

          if (playlist.image_file_id)
            deleteFile({ fileId: playlist.image_file_id });

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

          await batch.commit();

          const newPlaylists = ownPlaylists.filter((p) => p.id !== playlist.id);
          setOwnPlaylists(newPlaylists);

          if (isInLikeList) {
            const newFavoritePlaylists = favoritePlaylists.filter(
              (p) => p.id !== playlist.id,
            );
            setFavoritePlaylists(newFavoritePlaylists);
          }

          setSuccessToast(`Playlist '${playlist.name}' deleted`);
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

  return {
    isFetching,
    action,
    user,
  };
}

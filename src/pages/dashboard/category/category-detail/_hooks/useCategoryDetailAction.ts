import { RefObject, useState } from "react";
import { useCategoryContext } from "../CategoryContext";
import { useToastContext } from "@/stores";
import {
  deleteFile,
  myDeleteDoc,
  myUpdateDoc,
} from "@/services/firebaseService";
import { ModalRef } from "@/components";
import { serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useCategoryDetailAction(mainProps?: Props) {
  const {
    songs,
    setSongs,
    playlists,
    setPlaylists,
    orderedPlaylists,
    category,
    setCategory,
  } = useCategoryContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  const navigator = useNavigate();

  type AddSongs = {
    variant: "add-songs";
    songs: Song[];
  };

  type AddPlaylists = {
    variant: "add-playlists";
    playlists: Playlist[];
  };

  type ArrangePlaylists = {
    variant: "arrange-playlist";
    category: Partial<Category>;
  };

  type RemoveSong = {
    variant: "remove-song";
    song: Song;
    index: number;
  };

  type RemovePlaylist = {
    variant: "remove-playlist";
    playlist: Playlist;
    index: number;
  };

  type Delete = {
    variant: "delete";
  };

  const action = async (
    props:
      | AddSongs
      | AddPlaylists
      | ArrangePlaylists
      | RemoveSong
      | RemovePlaylist
      | Delete,
  ) => {
    try {
      if (!category) return;

      setIsFetching(true);
      switch (props.variant) {
        case "add-songs": {
          const newCategory = { ...category };
          const newSongs = [...songs, ...props.songs];

          const songIsList = newSongs.map((s) => s.id);

          const newCategoryData: Partial<Category> = {
            song_ids: songIsList.join("_"),
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Categories",
            data: newCategoryData,
            id: category.id,
          });

          Object.assign(newCategory, newCategoryData);
          setCategory(newCategory);

          setSongs(newSongs);
          setSuccessToast("Add song successful");

          break;
        }
        case "add-playlists": {
          const newCategory = { ...category };
          const newPlaylists = [...playlists, ...props.playlists];

          const playlistIdList = newPlaylists.map((p) => p.id);

          const newCategoryData: Partial<Category> = {
            playlist_ids: playlistIdList.join("_"),
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Categories",
            data: newCategoryData,
            id: category.id,
          });

          Object.assign(newCategory, newCategoryData);
          setCategory(newCategory);

          setPlaylists(newPlaylists);
          setSuccessToast("Add playlist successful");

          break;
        }

        case "arrange-playlist": {
          const newCategory = { ...category };

          const newCategoryData: Partial<Category> = {
            ...props.category,
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Categories",
            data: newCategoryData,
            id: category.id,
          });

          Object.assign(newCategory, props.category);
          setCategory(newCategory);

          setSuccessToast("Category updated");

          break;
        }

        case "remove-song": {
          const newCategory = { ...category };

          const newSongs = [...songs];

          newSongs.splice(props.index, 1);
          const newSongIds = newSongs.map((s) => s.id).join("_");

          const newCategoryData: Partial<Category> = {
            song_ids: newSongIds,
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Categories",
            data: newCategoryData,
            id: category.id,
          });

          Object.assign(newCategory, newCategoryData);

          setCategory(newCategory);
          setSongs(newSongs);

          setSuccessToast("Category updated");

          break;
        }

        case "remove-playlist": {
          const newCategory = { ...category };

          const newOrderedPlaylists = [...orderedPlaylists];
          newOrderedPlaylists.splice(props.index, 1);

          const newPlaylistsIds = newOrderedPlaylists
            .map((s) => s.id)
            .join("_");

          const newCategoryData: Partial<Category> = {
            playlist_ids: newPlaylistsIds,
            updated_at: serverTimestamp(),
          };

          await myUpdateDoc({
            collectionName: "Categories",
            data: newCategoryData,
            id: category.id,
          });

          Object.assign(newCategory, newCategoryData);

          setCategory(newCategory);
          setPlaylists(newOrderedPlaylists);

          setSuccessToast("Category updated");

          break;
        }
        case "delete": {
          if (!category) return;

          if (category.banner_file_id) {
            deleteFile({
              fileId: category.banner_file_id,
            });
          }

          if (category.image_file_id) {
            deleteFile({
              fileId: category.image_file_id,
            });
          }

          await myDeleteDoc({
            collectionName: "Categories",
            id: category.id,
          });

          setSuccessToast("Category deleted");

          navigator("/dashboard/category");

          break;
        }
      }

      mainProps?.modalRef.current?.close();
    } catch (error) {
      console.log(error);
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}

import { RefObject, useState } from "react";
import { useCategoryContext } from "../CategoryContext";
import { useToastContext } from "@/stores";
import { myUpdateDoc } from "@/services/firebaseService";
import { ModalRef } from "@/components";

type Props = {
  modalRef: RefObject<ModalRef>;
};

export default function useCategoryDetailAction(mainProps?: Props) {
  const { songs, setSongs, playlists, setPlaylists, category, setCategory } =
    useCategoryContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

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

  const action = async (props: AddSongs | AddPlaylists | ArrangePlaylists) => {
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

          await myUpdateDoc({
            collectionName: "Categories",
            data: props.category,
            id: category.id,
          });

          Object.assign(newCategory, props.category);
          setCategory(newCategory);
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

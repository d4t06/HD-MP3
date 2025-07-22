import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { sleep } from "@/utils/appHelpers";
import { useState } from "react";

export default function useGenreAction() {
  const { setGenres, genres } = useGenreContext();
  const { setErrorToast, setSuccessToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    type: "add";
    genre: GenreSchema;
  };

  type Edit = {
    type: "edit";
    genre: Partial<GenreSchema>;
    id: string;
  };

  type Delete = {
    type: "delete";
    id: string;
  };

  const action = async (props: Add | Edit | Delete) => {
    try {
      setIsFetching(true);
      switch (props.type) {
        case "add": {
          const foundedGenre = genres.find((g) => g.name === props.genre.name);

          if (foundedGenre) {
            await sleep(100);

            return setErrorToast("Genre already exist");
          }

          const docRef = await myAddDoc({
            collectionName: "Genres",
            data: props.genre,
          });

          const newGenre: Genre = {
            ...props.genre,
            id: docRef.id,
          };

          setGenres((prev) => [newGenre, ...prev]);
          setIsFetching(false);

          setSuccessToast("Add genre successful");

          return newGenre;
        }

        case "edit": {
          await myUpdateDoc({
            collectionName: "Genres",
            data: props.genre,
            id: props.id,
          });

          const newGenres = [...genres];

          const index = newGenres.findIndex((g) => g.id === props.id);

          const target = { ...genres[index] };
          Object.assign(target, props.genre);
          newGenres[index] = target;

          setGenres(newGenres);
          setSuccessToast("Edit genre successful");

          break;
        }

        case "delete": {
          await myDeleteDoc({
            collectionName: "Genres",
            id: props.id,
          });

          setGenres((prev) => prev.filter((g) => g.id !== props.id));

          setSuccessToast("Delete genre successful");

          break;
        }
      }
    } catch (error) {
    } finally {
      setIsFetching(false);
    }
  };
  return { isFetching, action };
}

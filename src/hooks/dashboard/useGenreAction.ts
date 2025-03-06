import { myAddDoc, myDeleteDoc, mySetDoc } from "@/services/firebaseService";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { useState } from "react";

export default function useGenreAction() {
  const { setGenres, genres } = useGenreContext();
  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    type: "add";
    name: string;
  };

  type Edit = {
    type: "edit";
    name: string;
    id: string;
    index: number;
  };

  type Delete = {
    type: "delete";
    id: string;
  };

  const action = async (props: Add | Edit | Delete) => {
    setIsFetching(true);

    switch (props.type) {
      case "add": {
        const docRef = await myAddDoc({
          collectionName: "Genres",
          data: { name: props.name },
        });

        const newGenre: Genre = { name: props.name, id: docRef.id };

        setGenres((prev) => [newGenre, ...prev]);
        setIsFetching(false);

        return newGenre;
      }

      case "edit": {
        await mySetDoc({
          collectionName: "Genres",
          data: { name: props.name },
          id: props.id,
        });

        const newGenres = [...genres];

        const target = { ...genres[props.index] };
        Object.assign(target, { name: props.name });

        newGenres[props.index] = target;

        setGenres(newGenres);

        setIsFetching(false);

        break;
      }

      case "delete": {
        await myDeleteDoc({
          collectionName: "Genres",
          id: props.id,
        });

        setGenres((prev) => prev.filter((g) => g.id !== props.id));

        setIsFetching(false);

        break;
      }
    }
  };
  return { isFetching, action };
}

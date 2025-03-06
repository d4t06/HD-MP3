import { db } from "@/firebase";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { collection, getDocs, query } from "firebase/firestore";
import { useState } from "react";

export default function useGetGenre() {
  const { genres, setGenres, shouldFetchGenre } = useGenreContext();

  const [isFetching, setIsFetching] = useState(true);

  const api = async () => {
    try {
      const genreCollectionRef = collection(db, "Genres");
      const getQuery = query(genreCollectionRef);

      console.log(">>> fetch genres");

      const snapShot = await getDocs(getQuery);

      if (snapShot.docs) {
        const items = snapShot.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id } as Genre)
        );

        setGenres(items);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsFetching(false);
    }
  };

  return { api, isFetching, setIsFetching, genres, shouldFetchGenre };
}

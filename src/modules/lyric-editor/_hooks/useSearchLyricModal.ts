import { db } from "@/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FormEvent, useState } from "react";

export default function useSearchLyricModal() {
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);

  const [result, setResult] = useState<RawSongLyric[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsFetching(true);
      setIsShowResult(true);

      const singerCollectionRef = collection(db, "Lyrics");

      const searchQuery = query(
        singerCollectionRef,
        where("is_official", "==", true),
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const docSnaps = await getDocs(searchQuery);

      if (docSnaps.docs) {
        const result = docSnaps.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as RawSongLyric,
        );

        setResult(result);
      }
    } catch (err) {
      console.log({ message: err });
    } finally {
      setIsFetching(false);
    }
  };

  return { value, isShowResult, setValue, result, handleSubmit, isFetching };
}

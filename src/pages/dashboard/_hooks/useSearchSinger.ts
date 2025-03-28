import { db } from "@/firebase";
import { useToastContext } from "@/stores";
import { collection, getDocs, query, where } from "firebase/firestore";
import { FormEvent, useState } from "react";

type Props = {
  afterSearched?: () => void;
};

export default function useSearchSinger({ afterSearched = () => {} }: Props) {
  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);

  const [result, setResult] = useState<Singer[]>([]);

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();
      setIsFetching(true);
      setIsShowResult(true);

      const singerCollectionRef = collection(db, "Singers");

      const searchQuery = query(
        singerCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const docSnaps = await getDocs(searchQuery);

      if (docSnaps.docs) {
        const result = docSnaps.docs.map(
          (doc) => ({ ...doc.data(), id: doc.id }) as Singer,
        );

        setResult(result);
        afterSearched();
      }
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  return { value, isShowResult, setValue, result, handleSubmit, isFetching };
}

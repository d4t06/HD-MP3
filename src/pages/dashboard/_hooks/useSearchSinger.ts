import { implementSingerQuery } from "@/services/appService";
import {
  getSearchQuery,
  singerCollectionRef,
} from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { FormEvent, useState } from "react";

type Props = {
  afterSearched?: () => void;
  setIsFetchingParent?: (v: boolean) => void;
};

export default function useSearchSinger({
  afterSearched = () => {},
  setIsFetchingParent,
}: Props) {
  const { setErrorToast } = useToastContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [isShowResult, setIsShowResult] = useState(false);

  const [result, setResult] = useState<Singer[]>([]);

  const _setIsFetching = setIsFetchingParent || setIsFetching;

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();
      e.stopPropagation();

      if (isFetching) return;

      _setIsFetching(true);
      setIsShowResult(true);

      const q = getSearchQuery(singerCollectionRef, [], value);

      const singers = await implementSingerQuery(q);

      setResult(singers);
      afterSearched();
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      _setIsFetching(false);
    }
  };

  return { value, isShowResult, setValue, result, handleSubmit, isFetching };
}

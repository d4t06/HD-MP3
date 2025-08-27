import { FormEvent, useState } from "react";
import { useToastContext } from "@/stores";
import axios from "axios";

type Item = {
  link: string;
  image: {
    height: number;
    width: number;
  };
};

export default function useSearchImage() {
  const [items, setItems] = useState<Item[]>([]);

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      if (!value.trim() || isFetching) return;

      setIsFetching(true);

      const res = await axios.get<{ items: Item[] }>(
        `https://www.googleapis.com/customsearch/v1?q=${value}&cx=a473bfb57f63b40ef&key=${import.meta.env.VITE_GOOGLE_APIKEY}&searchType=image`,
      );

      if (res.data?.items) {
        setItems(res.data.items);
        setShowResult(true);
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
    value,
    setValue,
    handleSubmit,
    items,
    showResult,
  };
}

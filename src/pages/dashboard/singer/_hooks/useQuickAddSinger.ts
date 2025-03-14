import { myAddDoc } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useState } from "react";

export default function useQuickAddSinger() {
  const { setSuccessToast, setErrorToast } = useToastContext();

  const [isFetching, setIsFetching] = useState(false);

  type Add = {
    data: SingerSchema;
  };

  const addSinger = async ({ data }: Add) => {
    try {
      setIsFetching(true);

      const docRef = await myAddDoc({
        collectionName: "Singers",
        data: data,
      });

      const newSinger: Singer = { ...data, id: docRef.id };

      setIsFetching(false);

      setSuccessToast("Add singer successful");

      return newSinger;
    } catch (error) {
      console.log({ error });
    } finally {
      setErrorToast();
      setIsFetching(false);
    }
  };
  return { isFetching, addSinger };
}

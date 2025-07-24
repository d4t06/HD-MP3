import { FormEvent, useEffect, useState } from "react";
import { useToastContext } from "@/stores";
import { limit, orderBy, query, where } from "firebase/firestore";
import { singerCollectionRef } from "@/services/firebaseService";
import { implementSingerQuery } from "@/services/appService";
import { useSingerContext } from "@/stores/dashboard/SingerContext";

const tabs = ["All", "Result"] as const;

type Tab = (typeof tabs)[number];

export default function useDashboardSinger() {
  const { setSingers, singers } = useSingerContext();

  const [value, setValue] = useState("");
  const [isFetching, setIsFetching] = useState(true);
  const [tab, setTab] = useState<Tab>("All");

  const { setErrorToast } = useToastContext();

  const handleSubmit = async (e: FormEvent) => {
    try {
      e.preventDefault();

      setIsFetching(true);

      const searchQuery = query(
        singerCollectionRef,
        where("name", ">=", value),
        where("name", "<=", value + "\uf8ff"),
      );

      const result = await implementSingerQuery(searchQuery);
      setSingers(result);

      setTab("Result");
    } catch (err) {
      console.log({ message: err });
      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  const handleGetSingers = async () => {
    try {
      setIsFetching(true);

      const searchQuery = query(
        singerCollectionRef,
        orderBy("created_at", "desc"),
        limit(10),
      );

      const result = await implementSingerQuery(searchQuery);
      setSingers(result);
    } catch (err) {
      console.log({ message: err });

      setErrorToast();
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    if (tab === "All") handleGetSingers();
  }, [tab]);

  return {
    isFetching,
    value,
    setValue,
    handleSubmit,
    singers,
    tab,
    setTab,
    tabs,
  };
}

import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { useMemo, useState } from "react";
import useDebounce from "../useDebounce";

export default function useSearchGenre() {
  const { genres } = useGenreContext();

  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value, 800);

  const _genres = useMemo(
    () =>
      debouncedValue ? genres.filter((g) => g.name.includes(debouncedValue)) : genres,
    [debouncedValue, genres]
  );

  return { value, setValue, _genres };
}

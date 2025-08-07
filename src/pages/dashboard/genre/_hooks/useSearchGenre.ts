import { useDebounce } from "@/hooks";
import { useGenreContext } from "@/stores/dashboard/GenreContext";
import { convertToEn } from "@/utils/appHelpers";
import { useMemo, useState } from "react";

export default function useSearchGenre() {
  const { genres, subs, mains } = useGenreContext();

  const [value, setValue] = useState("");

  const debouncedValue = useDebounce(value, 800);

  const _genres = useMemo(
    () =>
      debouncedValue
        ? genres.filter((g) =>
            convertToEn(g.name).includes(convertToEn(debouncedValue)),
          )
        : [],
    [debouncedValue, genres],
  );

  return { value, setValue, _genres, mains, subs };
}

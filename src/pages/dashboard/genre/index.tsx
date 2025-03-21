import Title from "@/components/ui/Title";
import { NotFound, Skeleton } from "@/components";
import { DebounceSearchBar } from "../_components";
import { useGetGenre, useSearchGenre } from "../_hooks";
import { useEffect } from "react";
import AddNewGenreButton from "./_components/AddNewGenreButton";
import GenreItem from "./_components/GenreItem";

export default function DashboardGenrePage() {
  const { isFetching, api, shouldFetchGenre } = useGetGenre();
  const { _genres, ...rest } = useSearchGenre();

  useEffect(() => {
    if (shouldFetchGenre.current) {
      shouldFetchGenre.current = false;
      api();
    }
  }, []);

  return (
    <div className="pb-[46px]">
      <Title title="Genres" />

      <div className="flex justify-between items-start mt-3">
        <DebounceSearchBar {...rest} />
        <AddNewGenreButton />
      </div>

      <div className="mt-3">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <>
            {_genres.length ? (
              <div className="flex flex-wrap -mt-1 -mx-1">
                {_genres.map((g, i) => (
                  <GenreItem genre={g} key={i} />
                ))}
              </div>
            ) : (
              <NotFound />
            )}
          </>
        )}
      </div>
    </div>
  );
}

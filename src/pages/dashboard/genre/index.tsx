import Title from "@/components/ui/Title";
import { NotFound, Skeleton } from "@/components";
import { DebounceSearchBar, Frame } from "../_components";
import { useEffect } from "react";
import AddNewGenreButton from "./_components/AddNewGenreButton";
import GenreItem from "./_components/GenreItem";
import useGetGenre from "./_hooks/useGetGenre";
import useSearchGenre from "./_hooks/useSearchGenre";

export default function DashboardGenrePage() {
  const { isFetching, api } = useGetGenre();
  const { _genres, mains, subs, ...rest } = useSearchGenre();

  useEffect(() => {
    api();
  }, []);

  return (
    <>
      {/* <DashboardPageWrapper> */}
      <Title title="Genres" />

      <div className="flex justify-between items-start mt-3">
        <DebounceSearchBar {...rest} />
        <AddNewGenreButton value={rest.value} />
      </div>

      <div className="mt-5 space-y-5">
        {isFetching && <Skeleton className="h-[200px] rounded-xl" />}

        {!isFetching && (
          <>
            {_genres.length ? (
              <div className="flex flex-wrap -mt-2 -mx-2">
                {_genres.map((g) => (
                  <GenreItem genre={g} key={g.id} />
                ))}
              </div>
            ) : (
              <>
                <div>
                  <Title variant={"h3"} className="mb-1" title="Main genres" />

                  <Frame className="mt-1">
                    {mains.length ? (
                      <div className="flex flex-wrap -mt-2  -mx-2">
                        {mains.map((g) => (
                          <GenreItem genre={g} key={g.id} />
                        ))}
                      </div>
                    ) : (
                      <NotFound />
                    )}
                  </Frame>
                </div>

                <div>
                  <Title variant={"h3"} className="mb-1" title="Sub genres" />

                  <Frame className="mt-1">
                    {subs.length ? (
                      <div className="flex flex-wrap -mt-2 -mx-2">
                        {subs.map((g) => (
                          <GenreItem genre={g} key={g.id} />
                        ))}
                      </div>
                    ) : (
                      <NotFound />
                    )}
                  </Frame>
                </div>
              </>
            )}
          </>
        )}
      </div>
      {/* </DashboardPageWrapper> */}
    </>
  );
}

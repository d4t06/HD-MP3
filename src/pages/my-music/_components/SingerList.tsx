import { SingerItem, Skeleton, Title } from "@/components";
import { useEffect } from "react";
import useGetMyMusicSinger from "../_hooks/useGetMyMusicSinger";

export default function MyMusicSingerList() {
  const { isFetching, singers, getSinger } = useGetMyMusicSinger();

  const singerSkeleton = [...Array(3).keys()].map((i) => (
    <SingerItem variant="skeleton" key={i} />
  ));

  useEffect(() => {
    getSinger();
  }, []);

  if (isFetching)
    return (
      <>
        <Skeleton className="h-[48px] w-[160px]" />
        <div className={`flex flex-row flex-wrap -mx-2 mt-3`}>
          {singerSkeleton}
        </div>
      </>
    );

  if (!isFetching && !singers.length) return <></>;

  return (
    <>
      <div>
        <Title className="mb-2" title="Singers" />

        <div className={`flex flex-row flex-wrap -mx-3`}>
          {singers.map((s, i) => (
            <SingerItem variant="singer-item" singer={s} key={i} />
          ))}
        </div>
      </div>
    </>
  );
}

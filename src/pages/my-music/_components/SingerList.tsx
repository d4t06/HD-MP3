import { Image, Skeleton, Square, Title } from "@/components";
import { useEffect } from "react";
import useGetMyMusicSinger from "../_hooks/useGetMyMusicSinger";
import { Link } from "react-router-dom";

export default function MyMucisSingerList() {
  const { isFetching, singers, getSinger } = useGetMyMusicSinger();

  const singerSkeleton = [...Array(3).keys()].map((i) => (
    <div key={i} className="w-1/3 md:w-1/5 px-2">
      <Skeleton className="pt-[100%] rounded-full" />
      <Skeleton className="mt-1 w-full h-[24px]" />
    </div>
  ));

  useEffect(() => {
    getSinger();
  }, []);

  if (isFetching)
    return <div className={`flex flex-row flex-wrap -mx-2 mt-3`}>{singerSkeleton}</div>;

  if (!isFetching && !singers.length) return <></>;

  return (
    <>
      <div>
        <Title title="Singers" />

        <div className={`flex flex-row flex-wrap -mx-2 mt-3`}>
          {singers.map((s, i) => (
            <div key={i} className="w-1/3 md:w-1/5 px-2">
              <Link to={`/singer/${s.id}`}>
                <Square className="!rounded-full">
                  <Image src={s.image_url} className="hover:scale-[1.05] transition-transform" />
                </Square>
              </Link>
              <p className="mt-1 text-center text-lg">{s.name}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

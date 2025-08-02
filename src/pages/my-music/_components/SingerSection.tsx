import { Skeleton, Title } from "@/components";
import { useEffect } from "react";
import useGetMyMusicSinger from "../_hooks/useGetMyMusicSinger";
import SingerList from "@/components/ui/SingerList";

export default function MyMusicSingerSection() {
  const { isFetching, singers, getSinger } = useGetMyMusicSinger();

  useEffect(() => {
    getSinger();
  }, []);

  if (isFetching)
    return (
      <>
        <Skeleton className="h-[48px] w-[160px]" />
        <SingerList loading={isFetching} singers={[]} />
      </>
    );

  if (!isFetching && !singers.length) return <></>;

  return (
    <>
      <div>
        <Title className="mb-5" title="Singers" />

        <SingerList singers={singers} />
      </div>
    </>
  );
}

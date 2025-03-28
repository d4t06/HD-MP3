import { Image, Skeleton, Square } from "@/components";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import SingerCta from "./SingerCta";
import { useGetSingerContext } from "./GetSingerContext";

export default function SingerInfo() {
  const { singer } = useSingerContext();
  const { isFetching } = useGetSingerContext();

  if (!isFetching && !singer) return <></>;

  return (
    <>
      <div className="md:flex">
        <div className="w-[70%] mx-auto md:w-1/4 md:flex-shrink-0 md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Square>
              <Image
                src={singer?.image_url}
                blurHashEncode={singer?.blurhash_encode || ""}
              />
            </Square>
          )}
        </div>
        <div className="flex-grow flex flex-col mt-5 space-y-2.5  md:mt-0 md:ml-5">
          {isFetching ? (
            <>
              <Skeleton className="h-[60px] w-full md:w-[200px]" />
              <Skeleton className="h-[120px] w-full md:w-[70%]" />
              <Skeleton className="h-[17px] w-[200px]" />
            </>
          ) : (
            singer && (
              <>
                <p className="text-3xl leading-[2] font-playwriteCU">{singer.name}</p>

                <p>{singer.like} likes</p>

                <p className="line-clamp-2">{singer.description}</p>

                <SingerCta />
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

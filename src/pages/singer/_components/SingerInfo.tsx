import { Image, PEmoji, Skeleton } from "@/components";
import { useSingerContext } from "./SingerContext";
import SingerCta from "./SingerCta";

import { abbreviateNumber } from "@/utils/abbreviateNumber";
import { choVoTri } from "@/constants/app";

export default function SingerInfo() {
  const { isFetching, singer } = useSingerContext();

  if (!isFetching && !singer) return <></>;

  return (
    <>
      <div
        className={`md:flex bg-transparent relative z-0 pb-5 md:p-10 items-start`}
      >
        <div
          className={`absolute overflow-hidden -left-10 -top-[100px] -right-10 inset-0`}
        >
          <div className="relative h-full w-full">
            <div
              className={`absolute z-[-5] inset-0 bg-white/60 dark:bg-black/60  `}
            ></div>
            <img
              src={singer?.image_url || choVoTri.image}
              className="blur-[20px] absolute z-[-10] w-full h-full object-center object-cover"
            />
          </div>
        </div>

        <div className="w-[70%] aspect-[1/1] rounded-full overflow-hidden z-0 relative mx-auto md:w-1/4 md:flex-shrink-0 md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Image
              src={singer?.image_url}
              blurHashEncode={singer?.blurhash_encode}
              className="object-cover h-full"
            />
          )}
        </div>
        <div className="flex-grow z-0 relative flex flex-col mt-5 space-y-2.5  md:mt-0 md:ml-5">
          {isFetching ? (
            <>
              <Skeleton className="h-[36px] w-full md:w-[200px]" />
              <Skeleton className="h-[48px] w-full md:w-[100%]" />
            </>
          ) : (
            singer && (
              <>
                <div className="flex items-center font-bold">
                  <span className="text-2xl">{singer.name}</span>

                  <PEmoji size={'5'} className="ml-4 text-sm">
                    ❤️ {abbreviateNumber(singer.like)}
                  </PEmoji>
                </div>

                <p className="line-clamp-2 font-bold text-sm">{singer.description}</p>

                <SingerCta />
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

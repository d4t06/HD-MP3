import { Image, Skeleton, Square } from "@/components";
import { useSingerContext } from "./SingerContext";
import SingerCta from "./SingerCta";
import { useThemeContext } from "@/stores";

import simonCat from "@/assets/simon_empty.png";
import { abbreviateNumber } from "@/utils/abbreviateNumber";

export default function SingerInfo() {
  const { theme } = useThemeContext();
  const { isFetching, singer } = useSingerContext();

  if (!isFetching && !singer) return <></>;

  return (
    <>
      <div
        className={`md:flex bg-transparent relative z-0 pb-5 md:p-10 ${theme.text_color} `}
      >
        <div
          className={`absolute overflow-hidden -left-10 -top-[100px] -right-10 inset-0`}
        >
          <div className="relative h-full w-full">
            <div
              className={`absolute z-[-5] inset-0 ${theme.type === "light" ? "bg-white/50" : "bg-black/50"}  `}
            ></div>
            <img
              src={singer?.image_url || simonCat}
              className="blur-[50px] absolute z-[-10] w-full h-full object-center object-cover"
            />
          </div>
        </div>

        <div className="w-[70%] z-0 relative mx-auto md:w-1/4 md:flex-shrink-0 md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Square>
              <Image src={singer?.image_url} blurHashEncode={singer?.blurhash_encode} />
            </Square>
          )}
        </div>
        <div className="flex-grow z-0 relative flex flex-col mt-5 space-y-2.5  md:mt-0 md:ml-5">
          {isFetching ? (
            <>
              <Skeleton className="h-[60px] w-full md:w-[200px]" />
              <Skeleton className="h-[24px] w-[200px]" />
              <Skeleton className="h-[120px] w-full md:w-[100%]" />
            </>
          ) : (
            singer && (
              <>
                <p className="text-3xl font-bold">{singer.name}</p>

                <p>
                  <span className="text-base">❤️ </span>
                  {abbreviateNumber(singer.like)}
                </p>

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

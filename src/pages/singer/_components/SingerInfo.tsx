import { Image, NotFound, Skeleton } from "@/components";
import { useSingerContext } from "./SingerContext";
import SingerCta from "./SingerCta";
import { useThemeContext } from "@/stores";

export default function SingerInfo() {
  const { theme } = useThemeContext();
  const { isFetching, singer } = useSingerContext();

  if (!isFetching && !singer) return <NotFound less />;

  return (
    <>
      <div className="md:flex bg-transparent relative z-0 p-10 text-white">
        {singer?.blurhash_encode && (
          <>
            <div
              className={`absolute overflow-hidden -left-10 -top-[100px] -right-10 inset-0`}
            >
              <div className="relative h-full w-full">
                <div
                  className={`absolute z-[-5] inset-0 ${theme.type === "light" ? "bg-white/50" : "bg-black/50"}  `}
                ></div>
                <img
                  src={singer.image_url}
                  className="blur-[50px] absolute z-[-10] w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </>
        )}

        <div className="w-[70%] z-0 mx-auto md:w-1/4 md:flex-shrink-0 md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Image src={singer?.image_url} className="rounded-lg" />
          )}
        </div>
        <div className="flex-grow z-0 flex flex-col mt-5 space-y-2.5  md:mt-0 md:ml-5">
          {isFetching ? (
            <>
              <Skeleton className="h-[60px] w-full md:w-[200px]" />
              <Skeleton className="h-[120px] w-full md:w-[100%]" />
            </>
          ) : (
            singer && (
              <>
                <p className="text-3xl leading-[2] font-playwriteCU">{singer.name}</p>

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

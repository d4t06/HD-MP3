import { Image, NotFound, Skeleton } from "@/components";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import SingerCta from "./SingerCta";

export default function SingerInfo() {
  const { isFetching, singer } = useSingerContext();

  if (!isFetching && !singer) return <NotFound less />;

  return (
    <>
      <div className="md:flex">
        <div className="w-[70%] mx-auto md:w-1/4 md:flex-shrink-0 md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Image src={singer?.image_url} className="rounded-lg" />
          )}
        </div>
        <div className="flex-grow flex flex-col mt-5 space-y-2.5  md:mt-0 md:ml-5">
          {isFetching ? (
            <>
              <Skeleton className="h-[60px] w-full md:w-[200px]" />
              <Skeleton className="h-[120px] w-full md:w-[70%]" />
            </>
          ) : (
            singer && (
              <>
                <p className="text-3xl leading-[2] font-playwriteCU">{singer.name}</p>

                <p className="line-clamp-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem,
                  autem eligendi. Eveniet laudantium placeat provident nemo, quasi quam
                  animi tempore atque, nobis quaerat molestias expedita dignissimos illum
                  exercitationem voluptatem ipsam.
                </p>

                <div className="!mt-auto">
                  <SingerCta />
                </div>
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

import { Image, Skeleton, Title } from "@/components";
import { useSingerContext } from "@/stores/dashboard/SingerContext";
import SingerCta from "./SingerCta";
import { useGetSingerContext } from "./GetSingerContext";
import DetailFrame from "@/pages/dashboard/_components/ui/DetailFrame";
import { LikeBtn } from "@/pages/dashboard/_components";
import { myUpdateDoc } from "@/services/firebaseService";

export default function SingerInfo() {
  const { singer, setSinger } = useSingerContext();
  const { isFetching } = useGetSingerContext();

  const handleEditSinger = async (like: number, closeModal: () => void) => {
    if (!singer) return;

    await myUpdateDoc({
      collectionName: "Singers",
      id: singer.id,
      data: { like },
    });

    setSinger({ ...singer, like });

    closeModal();
  };

  if (!isFetching && !singer) return <></>;

  return (
    <>
      <div className="md:flex">
        <div className="flex-shrink-0 w-[260px] h-[260px] rounded-md overflow-hidden mx-auto md:m-unset">
          {isFetching ? (
            <Skeleton className="pt-[100%] " />
          ) : (
            <Image
              className="object-cover"
              src={singer?.image_url}
              blurHashEncode={singer?.blurhash_encode || ""}
            />
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
                <DetailFrame className="space-y-3">
                  <div>
                    <span>Name</span>
                    <Title variant={"h1"} title={singer.name} />
                  </div>

                  {/* <p>
                    <span className="text-red-500 text-xl">&#10084;</span>{" "}
                    {abbreviateNumber(singer.like)}
                  </p> */}

                  <LikeBtn
                    init={singer.like}
                    loading={false}
                    submit={handleEditSinger}
                  />

                  <p>
                    <span>Description</span> <br />
                    {singer.description}
                  </p>
                </DetailFrame>
                <SingerCta />
              </>
            )
          )}
        </div>
      </div>
    </>
  );
}

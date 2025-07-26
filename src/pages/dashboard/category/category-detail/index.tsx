import { useGetCategory } from "@/hooks";
import CategoryProvider, { useCategoryContext } from "./CategoryContext";
import { Image, Loading, NotFound, Title } from "@/components";
import CategoryCta from "./_components/CategoryCta";
import PlaylistSection from "./_components/PlaylistSection";
import SongSection from "./_components/SongSection";
import { dateFromTimestamp } from "@/utils/dateFromTimestamp";
import { useMemo } from "react";

export function Content() {
  const { category, setCategory } = useCategoryContext();

  const { isFetching } = useGetCategory({
    setCategory,
  });

  const lastUpdate = useMemo(() => category?.updated_at, [category?.id]);

  if (isFetching) {
    return <Loading />;
  }

  if (!category) return <NotFound />;

  return (
    <>
      <div className="pb-[46px]">
        <Title title="Category Detail" />

        <div className="aspect-[16/4] mt-5">
          <Image
            className="h-full object-cover rounded-lg"
            src={category.banner_image_url}
          />
        </div>

        <div className="md:flex md:-mx-3 mt-5">
          <div className="space-y-2.5 md:px-3">
            <div className="w-[200px] h-[200px]">
              <Image
                className="object-cover h-full rounded-lg"
                blurHashEncode={category.blurhash_encode}
                src={category.image_url}
              />
            </div>

            <div className="text-2xl font-bold text-[#333]">
              {category.name}
            </div>

            <CategoryCta />

            <p className="text-sm">
              Last updated: {dateFromTimestamp(lastUpdate)}
            </p>
          </div>

          <div className="w-full mt-3 md:mt-0 md:px-3 space-y-3">
            <SongSection />
            <PlaylistSection />
          </div>
        </div>
      </div>
    </>
  );
}

export default function CategoryDetailPage() {
  return (
    <CategoryProvider>
      <Content />
    </CategoryProvider>
  );
}

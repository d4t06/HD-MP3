import { Center, Loading } from "@/components";
import useGetPage from "./useGetPage";
import CategorySection from "./_components/CategorySection";
import PlaylistSection from "./category-detail/_components/PlaylistSection";
import Footer from "@/layout/primary-layout/_components/Footer";
import SliderSection from "./_components/SliderSection";

export default function CategoryPage() {
  const { page, isFetching } = useGetPage();

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  return (
    <>
      <div className="space-y-10 mt-10">
        <SliderSection
          categoryIds={page?.category_ids ? page?.category_ids.split("_") : []}
        />

        {page?.category_sections.map((c, i) => (
          <CategorySection
            key={i}
            title={c.name}
            category_ids={c.target_ids ? c.target_ids.split("_") : []}
          />
        ))}

        {page?.playlist_sections.map((c, i) => (
          <PlaylistSection
            key={i}
            title={c.name}
            playlistIds={c.target_ids ? c.target_ids.split("_") : []}
          />
        ))}
      </div>

      <Footer />
    </>
  );
}

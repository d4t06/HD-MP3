import { PageWrapper, Skeleton } from "@/components";
import useGetPage from "./useGetPage";
import CategorySection from "./_components/CategorySection";
import PlaylistSection from "./category-detail/_components/PlaylistSection";
import Footer from "@/layout/primary-layout/_components/Footer";
import SliderSection from "./_components/SliderSection";
import { usePageContext } from "@/stores";

export default function CategoryPage() {
  const { categoryPage } = usePageContext();
  const { isFetching } = useGetPage();

  const renderContent = () => {
    if (isFetching)
      return (
        <>
          <Skeleton className="pt-[25%] rounded-lg" />

          <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4   gap-4 mt-3">
            {[...Array(3).keys()].map((i) => (
              <Skeleton key={i} className="pt-[60%] rounded-lg" />
            ))}
          </div>
        </>
      );

    return (
      <>
        <SliderSection
          categoryIds={
            categoryPage?.category_ids
              ? categoryPage?.category_ids.split("_")
              : []
          }
        />

        {categoryPage?.category_sections.map((c, i) => (
          <CategorySection
            key={i}
            title={c.name}
            category_ids={c.target_ids ? c.target_ids.split("_") : []}
          />
        ))}

        {categoryPage?.playlist_sections.map((c, i) => (
          <PlaylistSection
            key={i}
            title={c.name}
            playlistIds={c.target_ids ? c.target_ids.split("_") : []}
          />
        ))}
      </>
    );
  };

  return (
    <>
      <PageWrapper>{renderContent()}</PageWrapper>

      <Footer />
    </>
  );
}

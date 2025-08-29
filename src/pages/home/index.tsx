import Footer from "@/layout/primary-layout/_components/Footer";
// import RecentPlaylist from "./_components/RecentPlaylist";
// import MobileSetting from "./_components/MobileSetting";
// import TrendingSong from "@/modules/trending-song";
import SliderSection from "../category/_components/SliderSection";
import { usePageContext } from "@/stores";
import PlaylistSection from "../category/category-detail/_components/PlaylistSection";
import useGetPage from "../category/useGetPage";
import { NotFound, PageWrapper, PlaylistItem, Skeleton } from "@/components";
// import NewSong from "@/modules/new-song";
import MobileNav from "./_components/MobileNav";
import MobileSetting from "./_components/MobileSetting";
// import RecommendSong from "./_components/RecommendSong";

export default function HomePage() {
  const { homePage } = usePageContext();

  const { isFetching } = useGetPage();

  const renderContent = () => {
    if (isFetching)
      return (
        <>
          <Skeleton className="pt-[25%] w-full rounded-lg" />

          <div className={`flex flex-row flex-wrap -mx-3`}>
            {[...Array(4).keys()].map((index) => (
              <PlaylistItem key={index} variant="skeleton" />
            ))}
          </div>
        </>
      );

    if (!homePage) return <NotFound />;

    return (
      <>
        <SliderSection
          categoryIds={
            homePage?.category_ids ? homePage?.category_ids.split("_") : []
          }
        />

        <MobileNav />

        {homePage?.playlist_sections.map((s, i) => (
          <PlaylistSection
            playlistIds={s.target_ids ? s.target_ids.split("_") : []}
            key={i}
          />
        ))}

   {/*     <RecommendSong />

        <RecentPlaylist />

        <TrendingSong amount={5} />

        <NewSong amount={5} />*/}

        <MobileSetting />
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

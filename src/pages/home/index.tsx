import Footer from "@/layout/primary-layout/_components/Footer";
// import HomePlaylist from "./_components/HomePlaylist";
// import HomeSongList from "./_components/HomeSongList";
import RecentPlaylist from "./_components/RecentPlaylist";
import MobileSetting from "./_components/MobileSetting";
import TrendingSong from "@/modules/trending-song";
import SliderSection from "../category/_components/SliderSection";
import { usePageContext } from "@/stores";
import PlaylistSection from "../category/category-detail/_components/PlaylistSection";
import useGetPage from "../category/useGetPage";
import { Center, Loading, NotFound } from "@/components";
import NewSong from "@/modules/new-song";

export default function HomePage() {
  const { homePage } = usePageContext();

  const { isFetching } = useGetPage();

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  if (!homePage) return <NotFound />;

  return (
    <>
      <div className="space-y-10 mt-10">
        <SliderSection
          categoryIds={
            homePage?.category_ids ? homePage?.category_ids.split("_") : []
          }
        />

        {homePage?.playlist_sections.map((s, i) => (
          <PlaylistSection
            playlistIds={s.target_ids ? s.target_ids.split("_") : []}
            key={i}
          />
        ))}

        <RecentPlaylist />

        {/*<TrendingSong amount={3} />*/}

        {/*<HomePlaylist />

        <HomeSongList />
*/}

        <NewSong amount={5} />

        <MobileSetting />
      </div>
      <Footer />
    </>
  );
}

import useGetPage from "../_hooks/useGetPage";
import { Loading } from "../_components";
import SliderSection from "../category/_components/SliderSection";
import { Center, Title } from "@/components";
import AddSectionBtn from "../category/_components/AddSectionBtn";
import { usePageContext } from "@/stores";
import PlaylistSection from "../category/_components/PlaylistSection";

export default function HomePageConfig() {
  const { homePage } = usePageContext();
  const { isFetching } = useGetPage();

  if (isFetching)
    return (
      <Center>
        <Loading />
      </Center>
    );

  return (
    <>
      <div className="space-y-5">
        <div className="flex justify-between">
          <Title title="Home Page" />

          <AddSectionBtn />
        </div>
        <SliderSection />

        {homePage?.playlist_sections.map((s, i) => (
          <PlaylistSection key={i} section={s} index={i} />
        ))}
      </div>
    </>
  );
}

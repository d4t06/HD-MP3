import AddSectionBtn from "./_components/AddSectionBtn";
import CategorySection from "./_components/CategorySection";
import PlaylistSection from "./_components/PlaylistSection";
import SliderSection from "./_components/SliderSection";
import { usePageContext } from "@/stores";
import useGetPage from "../_hooks/useGetPage";
import { Loading } from "../_components";
import { Title } from "@/components";

function Content() {
  const { categoryPage } = usePageContext();
  const { isFetching } = useGetPage();

  if (isFetching) return <Loading />;

  if (!categoryPage) return <></>;

  return (
    <>
      <div className="space-y-5 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-[#333] ">
        <div className="flex items-center justify-between">
          <Title title="Category" />

          <AddSectionBtn />
        </div>

        <SliderSection />

        {categoryPage.category_sections.map((s, i) => (
          <CategorySection key={i} section={s} index={i} />
        ))}

        {categoryPage.playlist_sections.map((s, i) => (
          <PlaylistSection key={i} section={s} index={i} />
        ))}
      </div>
    </>
  );
}

export default function CategoryPage() {
  return (
    <>
      {/*<CategoryLobbyProvider>*/}
        <Content />
      {/*</CategoryLobbyProvider>*/}
    </>
  );
}

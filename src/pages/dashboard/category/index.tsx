import { Loading, Title } from "@/components";
import useGetPage from "./hooks/useGetPage";
import CategoryLobbyProvider, {
  useCategoryLobbyContext,
} from "./CategoryLobbyContext";
import AddSectionBtn from "./_components/AddSectionBtn";
import CategorySection from "./_components/CategorySection";
import PlaylistSection from "./_components/PlaylistSection";

function Content() {
  const { page } = useCategoryLobbyContext();
  const { isFetching } = useGetPage();

  if (isFetching) return <Loading />;

  if (!page) return <></>;

  return (
    <>
      <div className="space-y-5 [&_h1]:text-lg [&_h1]:font-bold [&_h1]:text-[#333] ">
        <div className="flex items-center justify-between">
          <Title title="Category" />

          <AddSectionBtn />
        </div>

        {page.category_sections.map((s, i) => (
          <CategorySection key={i} section={s} index={i} />
        ))}

        {page.playlist_sections.map((s, i) => (
          <PlaylistSection key={i} section={s} index={i} />
        ))}
      </div>
    </>
  );
}

export default function CategoryPage() {
  return (
    <>
      <CategoryLobbyProvider>
        <Content />
      </CategoryLobbyProvider>
    </>
  );
}

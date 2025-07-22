import { Center } from "@/components";
import useGetPage from "./useGetPage";
import CategorySection from "./_components/CategorySection";

export default function CategoryPage() {
  const { page, isFetching } = useGetPage();

  if (isFetching) return <Center>Loading...</Center>;

  return (
    <>
      {page?.category_sections.map((c) => (
        <CategorySection title={c.name} category_ids={c.category_ids} />
      ))}
    </>
  );
}

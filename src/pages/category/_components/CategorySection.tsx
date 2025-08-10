import { Skeleton, Title } from "@/components";
import useGetCategories from "../_hooks/useGetCategories";
import CategoryItem from "./CategoryItem";

type Props = {
  title: string;
  category_ids: string[];
};

export default function CategorySection({ title, category_ids }: Props) {
  const { isFetching, categories } = useGetCategories({ category_ids });

  const loadingElement = [...Array(3).keys()].map((i) => (
    <Skeleton key={i} className="aspect-[5/3]" />
  ));

  return (
    <>
      <div>
        <Title variant={'h2'} title={title} />

        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4   gap-4 mt-3">
          {isFetching
            ? loadingElement
            : categories.map((c, i) => <CategoryItem key={i} category={c} />)}
        </div>
      </div>
    </>
  );
}

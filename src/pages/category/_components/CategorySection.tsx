import { Skeleton } from "@/components";
import useGetCategories from "../_hooks/useGetCategories";

type Props = {
  title: string;
  category_ids: string[];
};

export default function CategorySection({ title, category_ids }: Props) {
  const { isFetching, categories } = useGetCategories({ category_ids });

  const loadingElement = [...Array(3).keys()].map((i) => (
    <Skeleton key={i} className="aspect-[4/3]" />
  ));

  return (
    <>
      <div>
        <div>{title}</div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {!isFetching ? loadingElement : ""}
        </div>
      </div>
    </>
  );
}

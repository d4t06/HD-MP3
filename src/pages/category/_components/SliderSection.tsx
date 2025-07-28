import { Skeleton } from "@/components";
import useGetCategories from "../_hooks/useGetCategories";
import ImageSlider from "@/modules/slider";
import { useMemo } from "react";

type Props = {
  categoryIds: string[];
};

export default function SliderSection({ categoryIds }: Props) {
  const { isFetching, categories } = useGetCategories({
    category_ids: categoryIds,
  });

  const orderedCategories = useMemo(() => {
    const result: Category[] = [];

    categoryIds.forEach((id) => {
      const founded = categories.find((c) => c.id === id);
      if (founded) result.push(founded);
    });

    return result;
  }, [categories]);

  if (isFetching) return <Skeleton className="aspect-[16/4]" />;
  if (!categories.length) return <></>;

  return (
    <ImageSlider
      className="aspect-[16/4]"
      images={orderedCategories.map((c) => ({
        imageUrl: c.banner_image_url,
        link: `/category/${c.id}`,
        hash: c.banner_blurhash_encode,
      }))}
    />
  );
}

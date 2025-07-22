import { Image } from "@/components";
import { Link } from "react-router-dom";

type Props = {
  category: Category;
};

export default function CategoryItem({ category }: Props) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="aspect-[4/3] relative object-cover"
    >
      <Image className="w-full h-full" src={category.image_url} />

      <div className="absolute bottom-4 left-4">{category.name}</div>
    </Link>
  );
}

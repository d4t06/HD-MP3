import { Center, Image } from "@/components";
import { Link } from "react-router-dom";

type Props = {
  category: Category;
};

export default function CategoryItem({ category }: Props) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="aspect-[4/2]  group relative rounded-lg overflow-hidden"
    >
      <Image
        className="h-full group-hover:scale-[1.1] transition-transform duration-[.3s] object-cover"
        src={category.image_url}
      />


      <div className="absolute z-[0] inset-0 bg-black/10">

      <Center>
        <p className="text-xl font-bold text-white">{category.name}</p>
      </Center>

      </div>
    </Link>
  );
}

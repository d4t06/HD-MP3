import { Center, Image } from "@/components";
import RatioFrame from "@/components/ui/RatioFrame";
import { Link } from "react-router-dom";

type Props = {
  category: Category;
};

export default function CategoryItem({ category }: Props) {
  return (
    <Link
      to={`/category/${category.id}`}
      className="group relative rounded-lg overflow-hidden"
    >
      <RatioFrame className="pt-[60%]">
        <Image
          className="h-full group-hover:scale-[1.1] transition-transform duration-[.3s] object-cover"
          src={category.image_url}
          blurHashEncode={category.blurhash_encode}
        />

        <div className="absolute z-[0] inset-0 bg-black/20">
          <Center>
            <p className="text-xl font-bold text-white whitespace-nowrap">
              {category.name}
            </p>
          </Center>
        </div>
      </RatioFrame>
    </Link>
  );
}

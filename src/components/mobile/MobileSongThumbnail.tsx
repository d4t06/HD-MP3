import { Image } from "..";

interface Props {
  imageUrl?: string;
  expand: boolean;
  classNames?: string;
}

export default function MobileSongThumbnail({ imageUrl, expand }: Props) {
  return (
    <div
      className={` ${
        expand
          ? "w-full h-auto px-10 sm:w-[60px] sm:h-[60px] sm:px-0"
          : "w-[60px] h-[60px] p-0 flex-shrink-0"
      }`}
    >
      <Image src={imageUrl} className="w-full rounded-md" />
    </div>
  );
}

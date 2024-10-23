import { Image } from "..";

interface Props {
  data: Song | null;
  expand: boolean;
  classNames?: string;
}

export default function MobileSongThumbnail({ data, expand }: Props) {
  if (!data) return;

  return (
    <div
      className={` ${
        expand ? "w-full h-auto px-[20px]" : "w-[60px] h-[60px] p-0 flex-shrink-0"
      }`}
    >
      <Image src={data.image_url} classNames="w-full rounded-md" />
    </div>
  );
}

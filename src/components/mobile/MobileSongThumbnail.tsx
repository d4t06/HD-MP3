import { Image } from "..";

interface Props {
  data?: Song;
  expand: boolean;
  classNames?: string;
}

export default function MobileSongThumbnail({ data, expand }: Props) {
  // const classes = {
  //   container: "transition-[width,height,padding] duration-500 origin-top-left",
  //   image: "select-none object-cover object-center w-full",
  // };

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

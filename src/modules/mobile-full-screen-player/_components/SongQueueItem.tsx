import { MouseEventHandler } from "react";
import Image from "@/components/ui/Image";

type Props = {
  song: Song;
  onClick: MouseEventHandler;
  active: boolean;
};

// alway in state ready for select
export default function SongQueueItem({ song, onClick, active }: Props) {
  const classes = {
    itemContainer: `border-b 
    last:border-none border-white/10 rounded-md flex p-2 ${active ? "bg-white/10" : ""}`,
    imageFrame: `w-[54px] h-[54px] relative rounded-md overflow-hidden flex-shrink-0`,
  };

  return (
    <>
      <div onClick={onClick} className={`${classes.itemContainer} `}>
        <div className={`${classes.imageFrame}  `}>
          <Image blurHashEncode={song.blurhash_encode} src={song.image_url} />
        </div>

        {/* song info */}
        <div className={`ml-[10px]`}>
          <p className={`text-lg line-clamp-1 text-sm`}>{song.name}</p>
          <p className="opacity-70 line-clamp-1 text-sm">
            {song.singers.map((s, i) => (
              <span key={i}> {(i ? ", " : "") + s.name}</span>
            ))}
          </p>
        </div>
      </div>
    </>
  );
}

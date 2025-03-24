import { MouseEventHandler, useMemo } from "react";
import Image from "@/components/ui/Image";
import { useSongSelectContext } from "@/stores/SongSelectContext";

type BaseProps = {
  song: Song;
  theme: ThemeType & { alpha: string };
};

type Default = BaseProps & {
  variant: "default";

  active: boolean;
  onClick: MouseEventHandler;
};

type PlayingNext = BaseProps & {
  variant: "playing-next";
  onClick: MouseEventHandler;
};

type Select = BaseProps & {
  variant: "select";
};

type Props = Default | PlayingNext | Select;

// alway in state ready for select
export default function SongQueueItem({ song, theme, ...props }: Props) {
  const { selectedSongs, selectSong } = useSongSelectContext();

  const handleItemClick: MouseEventHandler = (e) => {
    switch (props.variant) {
      case "default":
      case "playing-next":
        return props.onClick(e);
      case "select":
        return selectSong(song);
    }
  };

  const isSelected = useMemo(() => {
    if (props.variant !== "select") return false;
    return selectedSongs.findIndex((s) => s.id === song.id) != -1;
  }, [selectedSongs]);

  const classes = {
    itemContainer: `items-center justify-between cursor-pointer border-b 
    last:border-none border-white/10 flex rounded-md p-2`,
    button: `${theme.content_bg} rounded-full`,
    songListButton: `mr-[10px] px-[5px]`,
    imageFrame: `w-[54px] h-[54px] relative rounded-[4px] overflow-hidden flex-shrink-0`,
    before: `after:content-[''] after:absolute after:h-[100%] after:w-[10px] after:right-[100%]`,
  };

  return (
    <>
      <div
        onClick={handleItemClick}
        className={`target-class opacity-100 transition-[opacity,transform] duration-500 ${classes.itemContainer} `}
      >
        <div className={`flex`}>
          <div className="flex-grow flex">
            <div className={`${classes.imageFrame}  `}>
              <Image blurHashEncode={song.blurhash_encode} src={song.image_url} />
            </div>

            {/* song info */}
            <div className={`ml-[10px]`}>
              <p className={`text-lg line-clamp-1 ${isSelected && theme.content_text}`}>
                {song.name}
              </p>
              <p className="opacity-60 bg-blend-lighten line-clamp-1">
                {song.singers.map((s, i) => (
                  <span key={i}> {(i ? ", " : "") + s.name}</span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import { getHidden } from "@/utils/appHelpers";
import { Image, SingerLinkList } from "@/components";
import { choVoTri } from "@/constants/app";

type Props = {
  isOpenFullScreen: boolean;
  song?: Song;
};

export default function SongInfo({ isOpenFullScreen, song }: Props) {
  const classes = {
    songInfoChild: "flex items-center",
  };

  return (
    <div className={`w-1/4 ${getHidden(isOpenFullScreen)}`}>
      <div
        className={`${classes.songInfoChild} ${getHidden(isOpenFullScreen)}`}
      >
        <div className={`w-14 h-14 flex-shrink-0`}>
          <Image
            src={song?.image_url || choVoTri.image}
            blurHashEncode={song?.blurhash_encode}
            className={`rounded-md h-full object-cover`}
          />
        </div>

        <div className="ml-2 font-bold flex-grow">
          <p className="line-clamp-1 text-sm">{song?.name || "..."}</p>
          {/*<div className="h-6">
            <ScrollText className="" content={song?.name || "..."} />
          </div>*/}
          {song && (
            <div className="text-xs item-info mt-0.5 line-clamp-1">
              <SingerLinkList singers={song.singers} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

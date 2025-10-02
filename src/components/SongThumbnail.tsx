import { ForwardedRef, forwardRef } from "react";
import playingIcon from "../assets/icon-playing.gif";
import { Image } from ".";
import { choVoTri } from "@/constants/app";
import { PauseIcon } from "@heroicons/react/20/solid";

interface Props {
  data: Song | undefined;
  active: boolean;
  onClick?: () => void;
  hasTitle?: boolean;
  classNames?: string;
  idleClass?: string;
}

const SongThumbnail = (
  { data, active, onClick, hasTitle, classNames = "", idleClass = "" }: Props,
  ref: ForwardedRef<HTMLDivElement>,
) => {
  const classes = {
    container: "flex flex-col",
    image: "select-none object-cover w-full",
    overlay: `absolute cursor-pointer ${
      active ? "" : "inset-0 hidden bg-black/40 items-center justify-center"
    }   group-hover:flex`,
    playingGifFrame:
      "absolute h-[30px] w-[30px] bottom-[15px] left-[15px] -z-1",
  };

  if (!data) return;

  return (
    <div
      ref={ref}
      queue-id={data.queue_id}
      className={`song-thumb ${active ? "active" : ""} ${classes.container} ${idleClass}`}
    >
      <div className={`${classNames} image-container`}>
        <div className={`image-frame group ${active ? "w-full" : "w-[80%]"}`}>
          <Image
            fallback={choVoTri.image}
            src={data.image_url || choVoTri.image}
            blurHashEncode={data.blurhash_encode}
          />
          {
            <div className={`${classes.overlay} `} onClick={onClick}>
              {!active && <PauseIcon className="w-7" />}
            </div>
          }

          {active && (
            <div className={classes.playingGifFrame}>
              <img src={playingIcon} alt="" />
            </div>
          )}
        </div>
      </div>

      {hasTitle && (
        <div className="text-center font-bold mt-3">
          <p className="text-ellipsis line-clamp-1 text-lg">
            {data?.name || "..."}
          </p>
          <p className="line-clamp-1 text-sm">
            {data.singers.map((s, i) => (
              <span key={i}>
                {!!i && ", "}
                {s.name}
              </span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default forwardRef(SongThumbnail);

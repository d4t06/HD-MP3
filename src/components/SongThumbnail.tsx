import { ForwardedRef, forwardRef } from "react";
import Button from "./ui/Button";
import { PauseCircleIcon } from "@heroicons/react/24/outline";
import playingIcon from "../assets/icon-playing.gif";
import { Image } from ".";

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
  ref: ForwardedRef<HTMLDivElement>
) => {
  const classes = {
    container: "flex flex-col",
    imageFrame:
      "group relative transition-[width] duration-[.3s] origin-center rounded-xl overflow-hidden",
    image: "select-none object-cover object-center rounded w-full",
    overlay: `absolute  ${
      active ? "" : "inset-0 hidden bg-black/40 items-center justify-center"
    }   group-hover:flex`,
    playingGifFrame: "absolute h-[30px] w-[30px] bottom-[15px] left-[15px] -z-1",
    title: "text-2xl text-white mt-3 font-bold text-ellipsis line-clamp-1",
  };

  if (!data) return;

  return (
    <div
      ref={ref}
      queue-id={data.queue_id}
      className={`song-thumb ${active ? "active" : ""} ${classes.container} ${idleClass}`}
    >
      <div
        className={`${classNames} flex items-end justify-center flex-shrink-0 w-[350px] h-[350px] min-[1536px]:w-[450px] min-[1536px]:h-[450px] `}
      >
        <div
          className={`border-[4px] rounded-[6px] overflow-hidden border-transparent ${
            classes.imageFrame
          } ${
            active
              ? "w-[350px] min-[1536px]:w-[450px]"
              : "w-[280px] min-[1536px]:w-[330px]"
          }`}
        >
          <Image src={data.image_url} blurHashEncode={data.blurhash_encode} />
          {
            <div className={`${classes.overlay}`}>
              {!active && (
                <Button
                  onClick={onClick}
                  variant={"circle"}
                  hover={"scale"}
                  size={"clear"}
                  className={`p-2 hover:bg-[#fff]/10`}
                >
                  <PauseCircleIcon className="w-10" />
                </Button>
              )}
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
        <div className="text-center">
          <h2 className={classes.title}>{data?.name || "Some song"}</h2>
          <p className="text-md opacity-50 line-clamp-1">
            {data.singers.map((s, i) => (
              <span key={i}>{s.name}</span>
            ))}
          </p>
        </div>
      )}
    </div>
  );
};

export default forwardRef(SongThumbnail);

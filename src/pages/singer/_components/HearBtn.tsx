import { ArrowPathIcon } from "@heroicons/react/24/outline";
import useLikeSinger from "../_hooks/useLikeSinger";
import { useMemo } from "react";
import { useSingerContext } from "./SingerContext";

export default function HearBtn() {
  const { singer } = useSingerContext();

  const { likeSinger, isFetching, user } = useLikeSinger();

  const isLiked = useMemo(
    () =>
      user
        ? singer
          ? user.liked_singer_ids.includes(singer.id)
          : false
        : false,
    [user],
  );

  if (!singer) return <></>;

  return (
    <button
      onClick={() =>
        likeSinger({
          singer,
        })
      }
      className={`${isLiked ? "text-[--primary-cl]" : ""} [&_img]:w-6`}
    >
      {isFetching ? (
        <ArrowPathIcon className="animate-spin" />
      ) : (
        <>{isLiked ? <img src="./icons/heart.png" /> : <img src="./icons/grey_heart.png" />}</>
      )}
    </button>
  );
}

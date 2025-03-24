import { useThemeContext } from "@/stores";
import { HeartIcon as HeartIconSolid } from "@heroicons/react/20/solid";
import { ArrowPathIcon, HeartIcon } from "@heroicons/react/24/outline";
import useLikeSinger from "../_hooks/useLikeSinger";
import { useMemo } from "react";
import { useSingerContext } from "./SingerContext";

export default function HearBtn() {
  const { theme } = useThemeContext();
  const { singer } = useSingerContext();

  const { likeSinger, isFetching, user } = useLikeSinger();

  const isLiked = useMemo(
    () => (user ? (singer ? user.liked_singer_ids.includes(singer.id) : false) : false),
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
      className={`rounded-full p-2  ${isLiked ? theme.content_bg : "bg-" + theme.alpha}`}
    >
      {isFetching ? (
        <ArrowPathIcon className="w-5 animate-spin" />
      ) : (
        <>
          {isLiked ? (
            <HeartIconSolid className={`w-5`} />
          ) : (
            <HeartIcon className="w-5" />
          )}
        </>
      )}
    </button>
  );
}

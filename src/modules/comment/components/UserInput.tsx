import { Image } from "@/components";
import useCommentAction from "../hooks/useCommentAction";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectSongQueue } from "@/stores/redux/songQueueSlice";
import { useCommentContext } from "./CommentContext";
import { selectCurrentPlaylist } from "@/stores/redux/currentPlaylistSlice";
import { useAuthContext, useThemeContext } from "@/stores";
import { PlayIcon, ArrowPathIcon } from "@heroicons/react/20/solid";
import { inputClasses } from "@/components/ui/Input";

type Props = {
  onSubmited?: () => void;
};

type SendComment = {
  variant: "comment";
};

type SendReply = {
  variant: "reply";
  comment: UserComment;
  comment_index: number;
};

export default function UserInput({
  onSubmited,
  ...props
}: (SendComment | SendReply) & Props) {
  const { user } = useAuthContext();
  const { theme } = useThemeContext();

  const { target } = useCommentContext();
  const { currentSongData } = useSelector(selectSongQueue);
  const { currentPlaylist } = useSelector(selectCurrentPlaylist);

  const [value, setValue] = useState("");

  const { action, isFetching } = useCommentAction();

  const handleAddComment = async () => {
    if (!value || !value.trim()) return;

    if (
      (target === "song" && !currentSongData) ||
      (target === "playlist" && !currentPlaylist)
    )
      return;

    const targetId =
      target === "song" ? currentSongData?.song.id : currentPlaylist?.id;
    if (!targetId) return;

    switch (props.variant) {
      case "comment":
        await action({
          type: "add",
          target_id: targetId,
          text: value,
        });

        break;
      case "reply":
        await action({
          type: "reply",
          text: value,
          comment: props.comment,
          comment_index: props.comment_index,
        });

        break;
    }

    setValue("");
    onSubmited && onSubmited();
  };

  const inputPlaceholder =
    props.variant === "comment"
      ? "..."
      : `Reply to ${props.comment.user_name}...`;

  return (
    <div className="flex w-full">
      <div className="w-[40px] h-[40px] flex-shrink-0">
        <Image src={user?.photo_url} className="rounded-full" />
      </div>

      <div
        className={`rounded-lg ml-2 flex-grow  p-1.5 flex items-end bg-white/10`}
      >
        <textarea
          placeholder={inputPlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={(value.match(/\n/g) || []).length + 1}
          className={`${inputClasses} resize-none max-h-[30vh]  w-full bg-transparent border-none text-white`}
        />

        <button
          onClick={handleAddComment}
          className={`${theme.content_text} p-1.5 hover:bg-white/10 rounded-full`}
        >
          {isFetching ? (
            <ArrowPathIcon className="w-6 animate-spin" />
          ) : (
            <PlayIcon className="w-6" />
          )}
        </button>
      </div>
    </div>
  );
}

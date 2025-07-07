import { ChatBubbleBottomCenterIcon } from "@heroicons/react/20/solid";
import HeartBtn from "./HeartBtn";
import { useAuthContext } from "@/stores";
import { useCommentContext } from "@/modules/comment/components/CommentContext";

type Props = {
  song: Song;
};

export default function SongItemCta({ song }: Props) {
  const { setIsOpenComment } = useCommentContext();

  const { user } = useAuthContext();

  return (
    <div
      className="flex 
			space-x-2
			[&_button]:rounded-full
			[&_button]:p-2
			[&_svg]:w-6
			hover:[&_button]:bg-white/10
			[&_div]:flex-col
			[&_div]:flex
			[&_span]:text-center
			[&_span]:font-medium
		 "
    >
      {user && (
        <div>
          <HeartBtn
            isLiked={user.liked_song_ids.includes(song.id)}
            song={song}
          />
        </div>
      )}
      <div>
        <button onClick={() => setIsOpenComment(true)}>
          <ChatBubbleBottomCenterIcon />
        </button>
      </div>
    </div>
  );
}

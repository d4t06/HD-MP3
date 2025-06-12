import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import CommentList from "../comment";
import useGetComment from "./_hooks/useGetComment";
import { Button } from "@/components";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

export default function SongCartComment() {
  const { isOpenComment, currentSong, setIsOpenComment } = useSongsContext();
  const { themeClass } = useThemeContext();

  const { comments } = useGetComment();

  const activeClass = isOpenComment ? "right-0" : "right-[-400px]";

  const classes = {
    border: `${themeClass("border-black/20", "border-white/20")}`,
  };

  return (
    <div
      className={`transition-[right] duration-[.3s] h-full min-h-[360px] w-[400px] p-4 absolute top-0 ${activeClass}`}
    >
      <div className={`border  h-full w-full rounded-xl ${classes.border}`}>
        <div
          className={`flex items-center justify-between border-b p-3 ${classes.border}`}
        >
          <div className="font-playwriteCU">Comments</div>

          <Button
            onClick={() => setIsOpenComment(false)}
            className="p-1.5 hover:bg-black/20"
            size={"clear"}
          >
            <XMarkIcon className="w-6" />
          </Button>
        </div>

        {import.meta.env.DEV && <span>({currentSong?.name})</span>}
        <CommentList comments={comments} />
      </div>
    </div>
  );
}

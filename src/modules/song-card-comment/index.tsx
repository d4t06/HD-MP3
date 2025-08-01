import CommentList from "../comment";
import useGetSongCardComment from "./_hooks/useGetComment";
import { Button, Title } from "@/components";
import { useAuthContext, useThemeContext } from "@/stores";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useCommentContext } from "../comment/components/CommentContext";
import UserInput from "../comment/components/UserInput";
import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";

export default function SongCardComment() {

  const { user } = useAuthContext()
  const { themeClass } = useThemeContext();

  const { currentSong } = useSongsContext()
  const { isOpenComment, setIsOpenComment } = useCommentContext();

  useGetSongCardComment();

  const { comments, isFetching } = useCommentContext();

  const activeClass = isOpenComment
    ? "semi-lg:right-0 block"
    : "semi-lg:right-[-100%] hidden semi-lg:block";

  const classes = {
    border: `${themeClass("border-black/20", "border-white/20")}`,
  };

  return (
    <>
      <div
        className={`${isOpenComment ? "fixed" : ""} semi-lg:hidden bg-black/60 inset-0 z-[90]`}
      ></div>

      <div
        className={`transition-[right] max-h-[80vh] sm:max-h-[unset] max-w-[90vw] duration-[.3s] z-[99] semi-lg:z-[0] absolute rounded-xl  left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] semi-lg:left-[unset] semi-lg:top-0 semi-lg:transform-none semi-lg:h-full semi-lg:min-h-[360px] w-[400px] xl:w-[480px] semi-lg:p-4 top-0 ${activeClass}`}
      >
        <div
          className={`semi-lg:border text-white h-[400px] bg-[#333] p-5 semi-lg:p-3 semi-lg:h-full w-full rounded-xl flex flex-col ${classes.border}`}
        >
          <div className={`flex items-center justify-between`}>

          <Title variant={'h2'} title="Comments" />

            <Button
              onClick={() => setIsOpenComment(false)}
              className="p-1.5 hover:bg-black/20"
              size={"clear"}
            >
              <XMarkIcon className="w-8" />
            </Button>
          </div>

          <CommentList
            variant="dark-bg"
            isFetching={isFetching}
            comments={comments}
            className="pr-2"
          />

          {user && currentSong && <UserInput variant="comment" targetId={currentSong.id} />}
        </div>
      </div>
    </>
  );
}

import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import CommentList from "../comment";
import useGetComment from "./_hooks/useGetComment";
import { Button } from "@/components";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

export default function SongCardComment() {
  const { isOpenComment, setIsOpenComment } = useSongsContext();
  const { themeClass } = useThemeContext();

  const { comments, isFetching } = useGetComment();

  const activeClass = isOpenComment ? "lg:right-0 block" : "lg:right-[-100%] hidden lg:block";

  const classes = {
    border: `${themeClass("border-black/20", "border-white/20")}`,
  };

  return (
    <>
      <div
        className={`${isOpenComment ? "fixed" : ""} lg:hidden bg-black/60 inset-0 z-[90]`}
      ></div>

      <div
        className={`transition-[right] duration-[.3s] z-[99] bg-[#333] absolute rounded-xl left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] lg:left-[unset] lg:top-0 lg:transform-none  lg:bg-transparent lg:h-full lg:min-h-[360px] w-[400px] xl:w-[480px] p-4 top-0 ${activeClass}`}
      >
        <div
          className={`lg:border p-3 lg:h-full w-full rounded-xl flex flex-col ${classes.border}`}
        >
          <div className={`flex items-center justify-between`}>
            <div className="font-playwriteCU">Comments</div>

            <Button
              onClick={() => setIsOpenComment(false)}
              className="p-1.5 hover:bg-black/20"
              size={"clear"}
            >
              <XMarkIcon className="w-6" />
            </Button>
          </div>

          <CommentList variant="theme-bg" isFetching={isFetching} comments={comments} />
        </div>
      </div>
    </>
  );
}

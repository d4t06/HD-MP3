import { useSongsContext } from "@/pages/for-you/_stores/SongsContext";
import CommentList from "../comment";
import useGetComment from "./_hooks/useGetComment";
import { Button } from "@/components";
import { useThemeContext } from "@/stores";
import { XMarkIcon } from "@heroicons/react/20/solid";

export default function SongCardComment() {
  const { isOpenComment, setIsOpenComment } = useSongsContext();
  const { themeClass } = useThemeContext();

  const { comments, isFetching } = useGetComment();

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
        className={`transition-[right] duration-[.3s] z-[99] semi-lg:z-[0] absolute rounded-xl  left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] semi-lg:left-[unset] semi-lg:top-0 semi-lg:transform-none semi-lg:h-full semi-lg:min-h-[360px] w-[400px] xl:w-[480px] semi-lg:p-4 top-0 ${activeClass}`}
      >
        <div
          className={`semi-lg:border text-white h-[400px] bg-[#333] p-5 semi-lg:p-3 semi-lg:h-full w-full rounded-xl flex flex-col ${classes.border}`}
        >
          <div className={`flex items-center justify-between`}>
            <div className="font-playwriteCU text-xl">Comments</div>

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
        </div>
      </div>
    </>
  );
}

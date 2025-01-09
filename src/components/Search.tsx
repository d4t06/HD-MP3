import useSearch from "@/hooks/useSearch";
import { useTheme } from "@/store";
import { getDisable, getHidden } from "@/utils/appHelpers";
import {
  ArrowPathIcon,
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchbarSongList from "./SearchbarSongList";

export default function Search() {
  const { theme } = useTheme();

  const navigator = useNavigate();

  const {
    isFetching,
    formRef,
    searchResultRef,
    value,
    searchResult,
    setIsFocus,
    isFocus,
    setValue,
  } = useSearch();

  const classes = {
    container: `relative h-[40px] flex px-3 ${theme.text_color}`,
    unFocusContainer: `bg-${theme.alpha} rounded-[20px]`,
    focusedContainer: `${theme.content_bg} rounded-[20px_20px_0_0]`,
    input: `bg-transparent outline-none ${isFocus ? "placeholder-white" : ""}`,
    searchResultContainer: `${theme.content_bg} rounded-[0_0_20px_20px] p-3 position absolute top-full left-0 w-full max-h-[60vh] overflow-hidden flex flex-col`,
    listWrapper:
      "[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center  [&>*]:space-x-1 [&>*]:rounded-md hover:[&>*:not(div.absolute)]:bg-white/10",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    navigator(`/search?q=${value}`);
    setIsFocus(false);
  };

  return (
    <>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className={`${classes.container} ${
          isFocus ? classes.focusedContainer : classes.unFocusContainer
        }`}
      >
        <button className="mr-2">
          <MagnifyingGlassIcon className="w-6" />
        </button>
        <input
          value={value}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Nhac tet..."
          className={classes.input}
          type="text"
        />

        <button
          onClick={() => setValue("")}
          className={`${!!value ? "opacity-100" : "!opacity-0"} ${getDisable(!value)}`}
        >
          {isFetching ? (
            <ArrowPathIcon className="w-5 animate-spin" />
          ) : (
            <XMarkIcon className="w-5" />
          )}
        </button>

        <div
          ref={searchResultRef}
          className={`${getHidden(!isFocus)} ${classes.searchResultContainer}`}
        >
          {!searchResult.length ? (
            <>
              <div className="text-sm font-[500] mb-2">Suggestion keyword</div>
              <div className={classes.listWrapper}>
                <Link to="/search?q=nhac-tet">
                  <ArrowTrendingUpIcon className="w-5" />
                  <span>Nhac tet</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-[500] mb-2">Suggestion results</div>

              <div className={`${classes.listWrapper} overflow-auto no-scrollbar`}>
                <SearchbarSongList songs={searchResult} />
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
}

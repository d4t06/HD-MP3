import useSearch from "@/hooks/useSearch";
import { useTheme } from "@/store";
import { getDisable, getHidden } from "@/utils/appHelpers";
import {
  ArrowTrendingUpIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

export default function Search() {
  const { theme } = useTheme();

  const { isFetching, inputRef, value, searchResult, setIsFocus, isFocus, setValue } =
    useSearch();

  const classes = {
    container: `relative h-[40px] flex px-3 ${theme.text_color}`,
    unFocusContainer: `bg-${theme.alpha} rounded-[20px]`,
    focusedContainer: `${theme.content_bg} rounded-[20px_20px_0_0]`,
    input: "bg-transparent outline-none",
    searchResultContainer: `${theme.content_bg} rounded-[0_0_20px_20px] p-3 position absolute top-full left-0 w-full max-h-[60vh] `,
    listWrapper:
      "[&>*]:px-3 *:text-sm [&>*]:py-1 [&>*]:flex [&>*]:items-center  [&>*]:space-x-1 [&>*]:rounded-md hover:[&>*:not(div.absolute)]:bg-white/10",
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className={`${classes.container} ${
          isFocus ? classes.focusedContainer : classes.unFocusContainer
        }`}
      >
        <button className="mr-2">
          <MagnifyingGlassIcon className="w-6" />
        </button>
        <input
          ref={inputRef}
          onFocus={() => setIsFocus(true)}
          // onBlur={() => setIsFocus(false)}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Nhac tet..."
          className={classes.input}
          type="text"
        />

        <button
          onClick={() => setValue("")}
          className={`${value ? "opacity-100" : "opacity-0"} ${getDisable(!value)}`}
        >
          <XMarkIcon className="w-5" />
        </button>

        <div className={`${getHidden(!isFocus)} ${classes.searchResultContainer}`}>
          <div className="text-sm font-[500] mb-2">Suggestion</div>
          <div className={classes.listWrapper}>
            <Link to="/search?q=nhac-tet">
              <ArrowTrendingUpIcon className="w-5" />
              <span>Nhac tet</span>
            </Link>
          </div>
        </div>
      </form>
    </>
  );
}

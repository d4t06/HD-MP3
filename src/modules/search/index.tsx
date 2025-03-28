import useSearch from "./_hooks/useSearch";
import { useThemeContext } from "@/stores";
import { getDisable, getHidden } from "@/utils/appHelpers";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import SearchbarSongList from "./_components/SearchbarSongList";
import RecentSearchList from "./_components/RecentSearchList";

export default function Search() {
  const { theme } = useThemeContext();

  const navigator = useNavigate();

  const {
    isFetching,
    inputRef,
    formRef,
    searchResultRef,
    value,
    searchResult,
    setIsFocus,
    isFocus,
    setValue,
  } = useSearch();

  const classes = {
    container: `relative h-[40px] flex px-3 w-[300px] ${theme.text_color} shadow-md`,
    unFocusContainer: `bg-${theme.alpha} rounded-[20px]`,
    focusedContainer: `${theme.type === "dark" ? theme.modal_bg : theme.side_bar_bg} rounded-[20px_20px_0_0]`,
    input: `bg-transparent outline-none  w-full ${theme.type === "light" ? "placeholder:text-black" : "placeholder:text-white"}`,
    searchResultContainer: `${theme.type === "dark" ? theme.modal_bg : theme.side_bar_bg} shadow-md  rounded-[0_0_20px_20px] p-3 position absolute top-full left-0 w-full max-h-[60vh] overflow-hidden flex flex-col`,
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
          ref={inputRef}
          value={value}
          onFocus={() => setIsFocus(true)}
          onChange={(e) => setValue(e.target.value.trim())}
          placeholder="Nhac tet..."
          className={classes.input}
          type="text"
        />

        <button
          type="button"
          onClick={() => setValue("")}
          className={`${value ? "opacity-100" : "!opacity-0"} ${getDisable(!value)}`}
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
            <RecentSearchList />
          ) : (
            <>
              <div className="text-sm font-[500] mb-2">Suggestion results</div>

              <div className={`overflow-auto no-scrollbar`}>
                <SearchbarSongList songs={searchResult} />
              </div>
            </>
          )}
        </div>
      </form>
    </>
  );
}

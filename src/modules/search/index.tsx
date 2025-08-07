import useSearch, { RecentSearch } from "./_hooks/useSearch";
import {
  convertToEn,
  getDisable,
  getHidden,
  getLocalStorage,
} from "@/utils/appHelpers";
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { FormEvent, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SearchbarSongList from "./_components/SearchbarSongList";
import RecentSearchList from "./_components/RecentSearchList";
import { myAddDoc } from "@/services/firebaseService";

export default function Search() {

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
    trendingKeywords,
  } = useSearch();

  const recentSearchs = useMemo(
    () => getLocalStorage()["recent-search"] || ([] as RecentSearch[]),
    [isFocus],
  );

  const classes = {
    container: `relative z-[9] h-[40px] flex px-3 w-full md:w-[300px] shadow-md`,
    unFocusContainer: `bg-[--sidebar-cl] rounded-[20px]`,
    focusedContainer: `bg-[--popup-cl] rounded-[20px_20px_0_0]`,
    input: `bg-transparent outline-none placeholder:[#666] w-full`,
    searchResultContainer: `overflow-auto bg-[--popup-cl] shadow-md  rounded-[0_0_20px_20px] p-3 position absolute top-full left-0 w-full max-h-[60vh] flex flex-col`,
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    myAddDoc({
      collectionName: "Search_Logs",
      data: { keyword: convertToEn(value) },
      msg: "Add search log",
    });

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
          onChange={(e) => setValue(e.target.value)}
          placeholder="..."
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
            <RecentSearchList
              recentSearchs={recentSearchs}
              words={trendingKeywords}
            />
          ) : (
            <>
              <div className="text-sm font-semibold mb-2">Suggestion results</div>

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

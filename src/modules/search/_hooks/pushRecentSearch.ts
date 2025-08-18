import { getLocalStorage, setLocalStorage } from "@/utils/appHelpers";
import { RecentSearch } from "./useSearch";

export function pushRecentSearch(newItem: RecentSearch) {
  const recentSearchs: RecentSearch[] =
    getLocalStorage()["recent-search"] || [];

  const founded = recentSearchs.find(
    (item) => item.item.id === newItem.item.id,
  );

  if (!founded) {
    recentSearchs.unshift(newItem);
  }

  setLocalStorage("recent-search", recentSearchs.slice(0, 5));
}

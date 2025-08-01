import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { RecentSearch } from "../_hooks/useSearch";
import RecentSearchItem from "./RecentSearchItem";
import { useThemeContext } from "@/stores";
type Props = {
	words: string[];
	recentSearchs: RecentSearch[];
};

export default function RecentSearchList({ words, recentSearchs }: Props) {
	const { theme } = useThemeContext();

	const classes = {
		listWrapper:
			"[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center [&>*]:space-x-1 [&>*]:rounded-md ",
	};

	return (
		<>
			<div className="text-sm font-[500] mb-2">Suggestion keyword</div>
			<div className={`${classes.listWrapper} ${theme.type === 'light' ? 'hover:[&>*]:bg-black/5' : 'hover:[&>*]:bg-white/5'}`}>
				{words.map((w, i) => (
					<Link key={i} to={`/search?q=${w}`}>
						<ArrowTrendingUpIcon className="w-5" />
						<span>{w}</span>
					</Link>
				))}
			</div>

			<div className="text-sm font-[500] my-2">Recent search</div>
			<div className={classes.listWrapper}>
				{recentSearchs.map((item, i) => (
					<RecentSearchItem item={item} key={i} />
				))}
			</div>
		</>
	);
}

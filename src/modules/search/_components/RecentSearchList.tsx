import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { RecentSearch } from "../_hooks/useSearch";
import RecentSearchItem from "./RecentSearchItem";
type Props = {
	words: string[];
	recentSearchs: RecentSearch[];
};

export default function RecentSearchList({ words, recentSearchs }: Props) {

	const classes = {
		listWrapper:
			"[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center [&>*]:space-x-1 [&>*]:rounded-md ",
	};

	return (
		<>
			<div className="text-sm font-semibold mb-2">Suggestion keyword</div>
			<div className={`${classes.listWrapper} hover:[&>*]:bg-[--a-5-cl]`}>
				{words.map((w, i) => (
					<Link key={i} to={`/search?q=${w}`}>
						<ArrowTrendingUpIcon className="w-5" />
						<span className="text-sm">{w}</span>
					</Link>
				))}
			</div>

			<div className="text-sm font-semibold my-2">Recent search</div>
			<div className={classes.listWrapper}>
				{recentSearchs.map((item, i) => (
					<RecentSearchItem item={item} key={i} />
				))}
			</div>
		</>
	);
}

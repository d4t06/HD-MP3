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
			"[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center [&>*]:space-x-1 [&>*]:rounded-md hover:[&>*]:bg-white/10",
	};

	return (
		<>
			<div className="text-sm font-[500] mb-2">Suggestion keyword</div>
			<div className={classes.listWrapper}>
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

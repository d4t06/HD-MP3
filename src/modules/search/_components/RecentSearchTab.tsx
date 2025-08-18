import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { RecentSearch } from "../_hooks/useSearch";
import RecentSearchItem from "./RecentSearchItem";
import { Button } from "@/components";
type Props = {
	words: string[];
	recentSearchs: RecentSearch[];
	clear: () => void
};

export default function RecentSearchTab({ words, recentSearchs, clear }: Props) {


	const classes = {
		listWrapper:
			"[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center [&>*]:space-x-1 [&>*]:rounded-md ",
	};

	return (
		<>
			<div className="text-sm font-bold mb-2 ml-3">Suggestion keyword</div>
			<div className={`${classes.listWrapper} hover:[&>*]:bg-[--a-5-cl]`}>
				{words.map((w, i) => (
					<Link key={i} to={`/search?q=${w}`}>
						<ArrowTrendingUpIcon className="w-5" />
						<span className="text-sm">{w}</span>
					</Link>
				))}
			</div>

			{!!recentSearchs.length && (
				<>
					<div className="flex justify-between my-2 text-sm">
						<span className="font-bold">Recent search</span>

						<Button
							onClick={clear}
							className="text-[--primary-cl]"
							size={"clear"}
						>
							Clear
						</Button>
					</div>
					{recentSearchs.map((item, i) => (
						<RecentSearchItem item={item} key={i} />
					))}
				</>
			)}
		</>
	);
}

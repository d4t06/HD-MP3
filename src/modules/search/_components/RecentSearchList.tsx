import { ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

export default function RecentSearchList() {
	const classes = {
		listWrapper:
			"[&>*]:px-3 *:text-sm [&>*]:py-2 [&>*]:flex [&>*]:items-center [&>*]:space-x-1 [&>*]:rounded-md ",
	};

	return (
		<>
			<div className="text-sm font-[500] mb-2">Suggestion keyword</div>
			<div className={classes.listWrapper}>
				<Link to="/search?q=nhac-tet">
					<ArrowTrendingUpIcon className="w-5" />
					<span>Nhac tet</span>
				</Link>
			</div>
		</>
	);
}

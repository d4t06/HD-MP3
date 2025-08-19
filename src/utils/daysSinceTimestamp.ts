import { Timestamp } from "firebase/firestore";

export function daysSinceTimestamp(timestamp: Timestamp) {
	const date = timestamp.toDate();
	const now = new Date();

	const differenceInMilliseconds = now.getTime() - date.getTime();
	const differenceInDays = Math.floor(
		differenceInMilliseconds / (1000 * 60 * 60 * 24),
	);

	if (differenceInDays > 0)
		return differenceInDays + (differenceInDays > 1 ? " days ago" : " day ago");
	return "Today";
}

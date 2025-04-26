import { getDocs, orderBy, query, where } from "firebase/firestore";
import { commentCollectionRef } from "@/services/firebaseService";
import { useState } from "react";

export default function useGetComment() {
	const [] = useState(true);

	const fetchComment = async ({
		target_id,
		comment_id,
	}: {
		target_id?: string;
		comment_id?: string;
	}) => {
		if (import.meta.env.DEV) console.log("get comment");

		let searchQuery = query(commentCollectionRef);

		if (target_id) {
			searchQuery = query(
				searchQuery,
				where("target_id", "==", target_id),
				where("comment_id", "==", ""),
				orderBy("updated_at", "desc"),
			);
		}

		if (comment_id)
			searchQuery = query(
				searchQuery,
				where("comment_id", "==", comment_id),
				orderBy("created_at", "asc"),
			);

		const commentSnaps = await getDocs(searchQuery);

		if (!!commentSnaps.docs.length) {
			const result = commentSnaps.docs.map((doc) => {
				const singer: UserComment = {
					...(doc.data() as UserCommentSchema),
					id: doc.id,
					replies: [],
				};
				return singer;
			});

			return result;
		}
	};

	return { fetchComment };
}

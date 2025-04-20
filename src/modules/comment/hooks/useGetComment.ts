import { getDocs, orderBy, query, where } from "firebase/firestore";
import { commentCollectionRef } from "@/services/firebaseService";
import { useToastContext } from "@/stores";
import { useCommentContext } from "../components/CommemtContext";

export default function useGetComment() {
	const { setIsFetching } = useCommentContext();

	const { setErrorToast } = useToastContext();

	const fetchComment = async ({
		target_id,
		comment_id,
	}: {
		target_id?: string;
		comment_id?: string;
	}) => {
		try {
			setIsFetching(true);

			if (import.meta.env.DEV) console.log("get comment");

			let searchQuery = query(commentCollectionRef);

			if (target_id)
				searchQuery = query(searchQuery, where("target_id", "==", target_id));

			if (comment_id)
				searchQuery = query(searchQuery, where("comment_id", "==", comment_id));

			searchQuery = query(searchQuery, orderBy("updated_at", "desc"));

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
		} catch (err) {
			console.log({ message: err });

			setErrorToast();
		} finally {
			setIsFetching(false);
		}
	};

	return { fetchComment };
}

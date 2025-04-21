import { myAddDoc, myDeleteDoc, myUpdateDoc } from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { useState } from "react";
import { useCommentContext } from "../components/CommemtContext";
import { getDoc, increment } from "firebase/firestore";
import { initCommentObject } from "@/utils/factory";
import { setLocalStorage } from "@/utils/appHelpers";

export default function useCommentAction() {
	const { user, updateUserData } = useAuthContext();

	const { setComments } = useCommentContext();

	const [isFetching, setIsFetching] = useState(false);

	type Add = {
		type: "add";
		text: string;
		target_id: string;
	};

	type Like = {
		type: "like";
		id: string;
	};

	type Delete = {
		type: "delete";
		id: string;
		index: number;
	};

	const action = async (props: Add | Like | Delete) => {
		try {
			if (!user) return;

			setIsFetching(true);

			switch (props.type) {
				case "add": {
					const comment = initCommentObject({
						user,
						target_id: props.target_id,
						text: props.text,
					});

					const docRef = await myAddDoc({
						collectionName: "Comments",
						data: comment,
					});

					const newCommentSnap = await getDoc(docRef);

					if (newCommentSnap.exists()) {
						const newComment: UserComment = {
							...(newCommentSnap.data() as UserCommentSchema),
							id: docRef.id,
							replies: [],
						};

						setComments((prev) => [newComment, ...prev]);
						setIsFetching(false);
					}

					break;
				}

				case "like": {
					const newLikedCommentIds = [...user.liked_comment_ids];
					const foundedIndex = newLikedCommentIds.findIndex((id) => id === props.id);

					const isLike = foundedIndex === -1;

					if (isLike) newLikedCommentIds.push(props.id);
					else newLikedCommentIds.splice(foundedIndex, 1);

					const newCommentData = {
						like: increment(isLike ? 1 : -1),
					};

					await myUpdateDoc({
						collectionName: "Comments",
						data: newCommentData,
						id: props.id,
					});

					const newUserData: Partial<User> = {
						liked_comment_ids: newLikedCommentIds,
					};

					setLocalStorage("liked_comment_ids", newLikedCommentIds);
					updateUserData(newUserData);

					break;
				}

				case "delete": {
					await myDeleteDoc({
						collectionName: "Comments",
						id: props.id,
					});

					const newLikedCommentIds = [...user.liked_comment_ids];

					const foundedIndex = newLikedCommentIds.findIndex((id) => id === id);

					if (foundedIndex !== -1) {
						newLikedCommentIds.splice(foundedIndex, 1);

						setLocalStorage("liked_comment_ids", newLikedCommentIds);
					}

					setComments((prev) => prev.filter((g) => g.id !== props.id));

					break;
				}
			}
		} catch (error) {
			console.log({ error });
		} finally {
			setIsFetching(false);
		}
	};
	return { isFetching, action };
}

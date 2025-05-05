import {
	commentCollectionRef,
	myAddDoc,
myUpdateDoc,
} from "@/services/firebaseService";
import { useAuthContext } from "@/stores";
import { useState } from "react";
import { useCommentContext } from "../components/CommemtContext";
import {
	doc,
	getDoc,
	getDocs,
	increment,
	query,
	where,
	writeBatch,
} from "firebase/firestore";
import { initCommentObject } from "@/utils/factory";
import { setLocalStorage } from "@/utils/appHelpers";
import { db } from "@/firebase";

export default function useCommentAction() {
	const { user, updateUserData } = useAuthContext();

	const { setComments, comments } = useCommentContext();

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

	type Reply = {
		type: "reply";
		text: string;
		comment: UserComment;
		comment_index: number;
	};

	type Delete = {
		type: "delete";
		comment: UserComment;
	};

	const action = async (props: Add | Like | Delete | Reply) => {
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

				case "reply": {
					const { comment, comment_index, text } = props;

					const newCommentPayload = initCommentObject({
						user,
						target_id: comment.target_id,
						text: text,
						comment_id: comment.id,
					});

					const newCommentDocRef = await myAddDoc({
						collectionName: "Comments",
						data: newCommentPayload,
					});

					const newCommentSnap = await getDoc(newCommentDocRef);

					if (newCommentSnap.exists()) {
						const newCommentData = {
							reply: increment(1),
						};

						await myUpdateDoc({
							collectionName: "Comments",
							data: newCommentData,
							id: comment.id,
						});

						const newComment: UserComment = {
							...(newCommentSnap.data() as UserCommentSchema),
							id: newCommentDocRef.id,
							replies: [],
						};

						const newComments = [...comments];

						newComments[comment_index] = {
							...newComments[comment_index],
							replies: [...newComments[comment_index].replies, newComment],
						};

						setComments(newComments);
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
					const commentRef = doc(db, "Comments", props.comment.id);

					const batch = writeBatch(db);

					batch.delete(commentRef);

					if (!!props.comment.reply) {
						console.log(`Delete ${props.comment.reply} replies `);

						const queryGetReplies = query(
							commentCollectionRef,
							where("comment_id", "==", props.comment.id),
						);

						const repliesSnap = await getDocs(queryGetReplies);

						// const commitBatchPromises: Promise<void>[] = [];

						repliesSnap.forEach((replySnap) => {
							batch.delete(replySnap.ref);
							// commitBatchPromises.push(batch.commit());
						});

						// await Promise.all(commitBatchPromises);
					}

					await batch.commit();

					const newLikedCommentIds = [...user.liked_comment_ids];

					const foundedIndex = newLikedCommentIds.findIndex((id) => id === id);

					if (foundedIndex !== -1) {
						newLikedCommentIds.splice(foundedIndex, 1);

						setLocalStorage("liked_comment_ids", newLikedCommentIds);
					}

					setComments((prev) => prev.filter((g) => g.id !== props.comment.id));

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

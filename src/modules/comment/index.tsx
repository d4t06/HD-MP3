import { useAuthContext } from "@/stores";
import CommentItem from "./components/CommentItem";
import UserInput from "./components/UserInput";
import { Center } from "@/components";

type Props = {
	comments: UserComment[];
};

export default function CommentList({ comments }: Props) {
	const { user } = useAuthContext();

	return (
		<>
			<div className="flex-grow overflow-auto no-scrollbar">
				{comments.length ? (
					comments.map((c, i) => (
						<CommentItem level={1} index={i} key={c.id} comment={c} />
					))
				) : (
					<Center>...</Center>
				)}
			</div>

			{user && (
				<div className="pt-1.5">
					<UserInput variant="comment" />
				</div>
			)}
		</>
	);
}

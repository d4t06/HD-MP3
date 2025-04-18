import CommentItem from "./components/CommentItem";
import UserInput from "./components/UserInput";

type Props = {
	comments: UserComment[];
};

export default function CommentList({ comments }: Props) {
	return (
		<>
			<div className="flex-grow overflow-auto">
				{comments.map((c) => (
					<CommentItem comment={c} />
				))}
			</div>

			<UserInput />
		</>
	);
}

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
			<div className="flex-grow overflow-auto">
				{comments.length ? (
					comments.map((c, i) => <CommentItem index={i} key={c.id} comment={c} />)
				) : (
					<Center>...</Center>
				)}
			</div>

			{user && <UserInput />}
		</>
	);
}

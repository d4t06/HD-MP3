import { Image } from "@/components";
import { Link } from "react-router-dom";

type Props = {
	comment: UserComment;
};

export default function CommentItem({ comment }: Props) {
	return (
		<div className="p-2">
			<div className="flex items-center">
				<Image className="w-[44px] h-[44px]" src={comment.user_image_url} />
				<Link to={"/"}>{comment.user_name}</Link>
			</div>

			<div className="mt-1.5">{comment.text}</div>
		</div>
	);
}

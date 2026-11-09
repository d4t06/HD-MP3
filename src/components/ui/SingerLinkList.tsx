import { Link } from "react-router-dom";

type Props = {
	singers: Singer[];
	className?: string;
	link?:boolean
};

export default function SingerLinkList({
	singers,
	link = true,
	className = "hover:text-[--primary-cl]",
}: Props) {
	return singers.map((s, i) =>
		s.id && link ? (
			<span key={i}>
				{i ? ", " : ""}
				<Link to={`/singer/${s.id}`} className={`${className} hover:underline`}>
					{s.name}
				</Link>
			</span>
		) : (
			<span key={i}> {(i ? ", " : "") + s.name}</span>
		),
	);
}

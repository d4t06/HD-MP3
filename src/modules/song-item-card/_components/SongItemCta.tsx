import {
	ChatBubbleBottomCenterIcon,
	HeartIcon,
} from "@heroicons/react/24/outline";

export default function SongItemCta() {
	return (
		<div
			className="flex 
			space-x-2
			[&_button]:rounded-full
			[&_button]:p-2.5
			[&_button]:bg-white/10
			[&_div]:flex-col
			[&_div]:flex
			[&_span]:text-center
			[&_span]:font-medium
		 "
		>
			<div>
				<button>
					<HeartIcon className="w-6" />
				</button>
			</div>
			<div>
				<button>
					<ChatBubbleBottomCenterIcon className="w-6" />
				</button>
			</div>
		</div>
	);
}

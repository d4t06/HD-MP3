import { Button, Input } from "@/components";
import { MusicalNoteIcon } from "@heroicons/react/24/outline";

export default function UserInput() {
	return (
		<div className="flex w-full">
			<Input />
			<Button>
				<MusicalNoteIcon className="w-5" />
			</Button>
		</div>
	);
}

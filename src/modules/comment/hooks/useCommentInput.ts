import { useRef, useState } from "react";

// prettier-ignore
const EMOJIS = [
 '👍', '❤️', '😂', '😮', '😢', '😡',
 '😀', '😊', '😁', '😂', '🤣', '😍', '🤩', '🥳', '😎', '😇',
 '🤔', '🤫', '🤐', '😐', '😑', '😒', '🙄', '😬', '🤥', '😌',
 '👋', '🙏', '👏', '🙌', '👌', '💯', '🔥', '✨', '🎉', '🚀',
 '👍', '👎', '💪', '💖'
  ];

export default function useCommetInput() {
	const [value, setValue] = useState("");

	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const addEmoji = (emoji: string) => {
		const textarea = textareaRef.current;
		if (textarea) {
			const start = textarea.selectionStart;
			const end = textarea.selectionEnd;

			setValue(value.substring(0, start) + emoji + value.substring(end));

			setTimeout(() => {
				textarea.focus();
				textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
			}, 0);
		}
	};

	return { EMOJIS, addEmoji, textareaRef, value, setValue };
}

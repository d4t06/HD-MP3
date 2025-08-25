import { VariantProps, cva } from "class-variance-authority";
import { ReactNode } from "react";
import Twemoji from "react-twemoji";

const emojiVariants = cva("[&_img]:w-5 [&_img]:mr-[2px] [&_img]:inline", {
	variants: {
		size: {
			"6": "[&_img]:w-6",
			"5": "[&_img]:w-5",
			"4": "[&_img]:w-4",
		},
		align: {
			bottom: "[&_img]:align-text-bottom",
			clear: "",
		},
	},

	defaultVariants: {
		size: "5",
		align: "bottom",
	},
});

type Props = VariantProps<typeof emojiVariants> & {
	className?: string;
	children: ReactNode;
};

export default function PEmoji({
	className = "",
	size,
	children,
	align,
}: Props) {
	return (
		<p className={emojiVariants({ size, align, className })}>
			<Twemoji tag="span">{children}</Twemoji>
		</p>
	);
}

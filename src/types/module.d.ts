declare module "react-twemoji" {
	export default function Twemoji(props: {
		children?: ReactNode;
		options?: object;
		noWrapper?: boolean;
		tag?: string;
	}): ReactNode;
}

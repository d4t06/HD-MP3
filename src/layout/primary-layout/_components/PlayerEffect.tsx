import { ReactNode } from "react";
import useCountDown from "../_hooks/useCountDown";
import usePlayerEffect from "../_hooks/usePlayerEffect";

type Props = {
	children: ReactNode;
};

export default function PlayerEffect({ children }: Props) {
	usePlayerEffect();
	useCountDown();

	return children;
}

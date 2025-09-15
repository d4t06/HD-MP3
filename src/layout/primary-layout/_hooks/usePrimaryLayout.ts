import { usePlayerContext, useThemeContext } from "@/stores";
import { useEffect } from "react";

export default function usePrimayLayout() {
	const { isOpenFullScreen } = usePlayerContext();
	const { theme, isOnMobile } = useThemeContext();

	// const ranEffect = useRef(false);

	useEffect(() => {
		const meta = document.querySelector(".my-tag");

		const htmlEle = document.documentElement;

		htmlEle.setAttribute("data-theme", theme.id);

		if (theme.type === "dark") htmlEle.classList.add("dark");
		else htmlEle.classList.remove("dark");

		const body = document.body;
		if (isOnMobile) body.style.backgroundColor = "var(--layout-cl)";

		if (meta) meta.setAttribute("content", theme.container);
	}, [theme]);

	useEffect(() => {
		const body = document.querySelector("body");

		if (body) {
			if (isOpenFullScreen) {
				body.classList.add("full-screen");

				body.style.marginTop = `-${window.scrollY}px`;
				body.style.position = "fixed";
				body.style.inset = "0px";
			} else {
				body.classList.remove("full-screen");
				body.style.position = "relative";

				const needToScroll = +(+body.style.marginTop.slice(1, -2)).toFixed(1);
				body.style.marginTop = `0px`;
				window.scrollTo({
					top: needToScroll,
				});
			}
		}
	}, [isOpenFullScreen]);
}

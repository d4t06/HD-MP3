import { Bars3Icon } from "@heroicons/react/24/outline";
import { ReactNode } from "react";
import { useThemeContext } from "@/stores";
import MyPopup, { MyPopupContent, MyPopupTrigger } from "@/components/MyPopup";
import { PopupWrapper } from "@/components";
import { MenuList } from "@/components/ui/MenuWrapper";
import SystemSongCheckMenu from "./SystemSongCheckMenu";

export function CheckBarMenuContent({ children }: { children: ReactNode }) {
	const { theme } = useThemeContext();

	return (
		<MyPopupContent appendTo="portal">
			<PopupWrapper className={`py-2`} p={"clear"} theme={theme}>
				<MenuList>{children}</MenuList>
			</PopupWrapper>
		</MyPopupContent>
	);
}

type Props = {
	variant: "own-playlist" | "system-song" | "uploaded-song" | "favorite-song";
};
export default function CheckBarMenuBtn({ variant }: Props) {
	// stores

	const renderMenu = () => {
		switch (variant) {
			default:
				return <SystemSongCheckMenu />;
		}
	};

	return (
		<>
			<MyPopup appendOnPortal>
				<MyPopupTrigger>
					<button className="!p-1.5" type="button">
						<Bars3Icon className="w-5" />
					</button>
				</MyPopupTrigger>

				{renderMenu()}
			</MyPopup>
		</>
	);
}

import { PopupWrapper } from "@/components";
import MyPopup, {
	MyPopupContent,
	MyPopupTrigger,
	TriggerRef,
} from "@/components/MyPopup";
import { useTheme } from "@/store";
import { PlusIcon } from "@heroicons/react/20/solid";
import { useRef } from "react";
import useAddSingerButton from "../_hooks/useAddSingerButton";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { MenuList } from "@/components/ui/MenuWrapper";

type Props = {
	setSinger: (s: string) => void;
};

export default function AddSingerButton({ setSinger }: Props) {
	const { theme } = useTheme();

	const { isFetching, isEmpty, searchResult, value, setValue } = useAddSingerButton();

	const triggerRef = useRef<TriggerRef>(null);

	const handleAddNewSinger = () => {
		setSinger(value);
		triggerRef.current?.close();
	};

	return (
		<>
			<MyPopup appendOnPortal>
				<MyPopupTrigger ref={triggerRef}>
					<button className={`ml-2 ${theme.content_bg} rounded-full`}>
						<PlusIcon className="w-5" />
					</button>
				</MyPopupTrigger>
				<MyPopupContent appendTo="portal">
					<PopupWrapper bg="clear" className={`${theme.content_bg}`} theme={theme}>
						<div className="w-[200px] max-h-[50vh] flex flex-col overflow-hidden">
							<div className="rounded-md overflow-hidden text-white bg-black/10 flex items-center p-1.5 pl-2">
								<input
									value={value}
									onChange={(e) => setValue(e.target.value.trim())}
									placeholder="name..."
									className="bg-transparent min-w-[0] outline-none text-sm placeholder:text-white"
								/>

								<ArrowPathIcon
									className={`w-5 animate-spin ${isFetching ? "opacity-100" : "opacity-0"}`}
								/>
							</div>

							<MenuList className="mt-2">
								{/*<div className="flex-col mt-2 [&_button]:w-full [&_button]:py-1/5 ">*/}
								{searchResult.length
									? searchResult.map((s, i) => <button key={i}>{s}</button>)
									: isEmpty.current && (
											<button
												onClick={handleAddNewSinger}
												className={`inline-flex items-center space-x-1 rounded-md`}
											>
												<PlusIcon className="w-5" />
												<span>Add singer '{value}'</span>
											</button>
										)}
								{/*</div>*/}
							</MenuList>
						</div>
					</PopupWrapper>
				</MyPopupContent>
			</MyPopup>
		</>
	);
}

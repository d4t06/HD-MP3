import { Modal, ModalRef, TimerModal } from "@/components";
import { selectAllPlayStatusStore, setPlayStatus } from "@/stores/redux/PlayStatusSlice";
import { getClasses } from "@/utils/appHelpers";
import { ClockIcon } from "@heroicons/react/20/solid";
import { ClockIcon as ClockIconOutline } from "@heroicons/react/24/outline";
import { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function TimerButton() {
	const modalRef = useRef<ModalRef>(null);

	const dispatch = useDispatch();
	const { countDown } = useSelector(selectAllPlayStatusStore);

	const handleTriggerClick = () => {
		if (countDown) dispatch(setPlayStatus({ countDown: 0 }));
		else modalRef.current?.open();
	};

	return (
		<>
			<div>
				<button
					className={getClasses(!!countDown, "active")}
					onClick={handleTriggerClick}
				>
					{!!countDown ? (
						<ClockIcon className="w-6" />
					) : (
						<ClockIconOutline className="w-6" />
					)}
				</button>
				<span>
					{countDown ? countDown.toString().padStart(2, "") + " songs" : "Timer"}
				</span>
			</div>

			<Modal ref={modalRef} variant="animation">
				<TimerModal
					active={(t) => dispatch(setPlayStatus({ countDown: t }))}
					closeModal={() => modalRef.current?.close()}
				/>
			</Modal>
		</>
	);
}

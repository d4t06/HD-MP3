import {
	forwardRef,
	MouseEventHandler,
	ReactNode,
	Ref,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { createPortal } from "react-dom";

type Props = {
	children: ReactNode;
	onClose?: () => void;
	onOpen?: () => void;
	reRender?: boolean;
};

export type ModalRef = {
	toggle: () => void;
	close: () => void;
	open: () => void;
	setModalPersist: (v: boolean) => void;
};

function SlideModal(
	{ children, onClose, onOpen, reRender }: Props,
	ref: Ref<ModalRef>,
) {
	const [isOpen, setIsOpen] = useState(false);
	const [isMounted, setIsMounted] = useState(false);

	const toggle = () => {
		if (isMounted) setIsMounted(false);
		if (!isOpen) setIsOpen(true);
	};

	const open = () => {
		setIsOpen(true);
	};

	const close = () => {
		setIsMounted(false);
	};

	const handleOverlayClick: MouseEventHandler = (e) => {
		e.preventDefault();
		e.stopPropagation();

		close();
	};

	useImperativeHandle(ref, () => ({
		toggle,
		close,
		open,
		setModalPersist: () => {},
	}));

	useEffect(() => {
		if (!isMounted) {
			setTimeout(() => {
				setIsOpen(false);
				onClose && onClose();
			}, 200);
		}
	}, [isMounted]);

	useEffect(() => {
		if (isOpen) {
			setTimeout(() => {
				onOpen && onOpen();
				setIsMounted(true);
			}, 100);
		}
	}, [isOpen]);

	const classes = {
		unMountedContent: "translate-y-full ",
		mountedContent: "translate-y-0",
		unMountedLayer: "opacity-0",
		mountedLayer: "opacity-20",
	};

	return (
		<>
			{(isOpen || reRender) &&
				createPortal(
					<div
						className={`fixed inset-0 z-[99] ${reRender ? (isOpen ? "" : "hidden") : ""}`}
					>
						<div
							onClick={handleOverlayClick}
							className={`transition-opacity duration-200 absolute bg-black inset-0 z-[90]
                             ${isMounted ? classes.mountedLayer : classes.unMountedLayer}
                        `}
						></div>
						<div
							className={`modal-content absolute bottom-0 left-0 right-0 duration-200 transition-[transform,opacity] z-[99]
                            ${
															isMounted
																? classes.mountedContent
																: classes.unMountedContent
														}
                        `}
						>
							{children}
						</div>
					</div>,
					document.getElementById("portals")!,
				)}
		</>
	);
}

export default forwardRef(SlideModal);

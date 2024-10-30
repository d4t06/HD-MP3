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
import { PopupWrapper } from ".";
import { useTheme } from "../store";

type NoAnimation = {
  variant?: "default";
  children: ReactNode;
  closeModal: () => void;
  className?: string;
};

type WithAnimation = {
  variant?: "animation";
  children: ReactNode;
  className?: string;
};

type Props = NoAnimation | WithAnimation;

export type ModalRef = {
  toggle: () => void;
  close: () => void;
  open: () => void;
};

function Modal({ children, className, ...props }: Props, ref: Ref<ModalRef>) {
  const variant = props.variant || "default";

  const { theme } = useTheme();

  const [isOpen, setIsOpen] = useState(variant === "default" ? true : false);
  const [isMounted, setIsMounted] = useState(variant === "default" ? true : false);

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

    if (variant === "default") {
      // @ts-ignore
      props.closeModal ? props.closeModal() : "";
    }

    if (variant === "animation") toggle();
  };

  useImperativeHandle(ref, () => ({
    toggle,
    close,
    open,
  }));

  useEffect(() => {
    if (variant === "default") return;

    if (!isMounted) {
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
    }
  }, [isMounted]);

  useEffect(() => {
    if (variant === "default") return;

    if (isOpen) {
      setTimeout(() => {
        setIsMounted(true);
      }, 100);
    }
  }, [isOpen]);

  const classes = {
    unMountedContent: "opacity-0 scale-[.95]",
    mountedContent: "opacity-100 scale-[1]",
    unMountedLayer: "opacity-0",
    mountedLayer: "opacity-60",
  };

  return (
    <>
      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99]">
            <div
              onClick={handleOverlayClick}
              className={`transition-opacity duration-300 absolute bg-black inset-0 z-[90]
                             ${isMounted ? classes.mountedLayer : classes.unMountedLayer}
                        `}
            ></div>
            <div
              className={`absolute duration-300 transition-[transform,opacity] z-[99] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            ${
                              isMounted
                                ? classes.mountedContent
                                : classes.unMountedContent
                            }
                        `}
            >
              <PopupWrapper className={className || ""} theme={theme}>
                {children}
              </PopupWrapper>
            </div>
          </div>,
          document.getElementById("portals")!
        )}
    </>
  );
}

export default forwardRef(Modal);

import { useThemeContext } from "@/stores";
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

type BaseProps = {
  className?: string;
  children: ReactNode;
  persisted?: boolean;
};

type NoAnimation = {
  variant?: "default";
  closeModal: () => void;
};

type WithAnimation = {
  variant?: "animation";
  onClose?: () => void;
};

type Props = BaseProps & (NoAnimation | WithAnimation);

export type ModalRef = {
  toggle: () => void;
  close: () => void;
  open: () => void;
  setModalPersist: (v: boolean) => void;
};

function Modal(
  { children, className, persisted = false, ...props }: Props,
  ref: Ref<ModalRef>,
) {
  const variant = props.variant || "default";

  const [isOpen, setIsOpen] = useState(variant === "default" ? true : false);
  const [isMounted, setIsMounted] = useState(
    variant === "default" ? true : false,
  );
  const [persist, setPersist] = useState(persisted);

  const toggle = () => {
    if (isMounted) setIsMounted(false);
    if (!isOpen) setIsOpen(true);
  };

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsMounted(false);
    setPersist(false);
  };

  const setModalPersist = (v: boolean) => {
    setPersist(v);
  };

  const handleOverlayClick: MouseEventHandler = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (persist) return;

    if (variant === "default") {
      // @ts-ignore
      props.closeModal ? props.closeModal() : "";
    }

    if (variant === "animation") close();
  };

  useImperativeHandle(ref, () => ({
    toggle,
    close,
    open,
    setModalPersist,
  }));

  useEffect(() => {
    if (variant === "default") return;

    if (!isMounted) {
      setTimeout(() => {
        setIsOpen(false);

        // @ts-ignore
        props.onClose && props.onClose();
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
    mountedLayer: "opacity-40",
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
              className={`modal-content absolute duration-300 transition-[transform,opacity] z-[99] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
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

function ModalContentWrapper({
  children,
  noStyle,
  disable,
  className = "w-[400px]",
}: {
  disable?: boolean;
  children: ReactNode;
  className?: string;
  noStyle?: boolean;
}) {
  const { theme } = useThemeContext();

  return (
    <div
      className={`relative overflow-hidden max-h-[80vh] max-w-[90vw] flex flex-col  ${disable ? "disabled" : ""} ${!noStyle ? "p-3 md:p-4s rounded-xl" : ""} ${location.hash.includes("/dashboard") ? "bg-white text-black" : theme.modal_bg + " text-white"} ${className}`}
    >
      {children}
    </div>
  );
}

export default forwardRef(Modal);
export { ModalContentWrapper };

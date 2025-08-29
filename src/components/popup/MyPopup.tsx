import {
  cloneElement,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode,
  Ref,
  useEffect,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { usePopoverContext } from "./PopupContext";
import usePopupContent from "./usePopupContent";

type TriggerProps = {
  children: ReactNode;
  className?: string;
  needButton?: boolean;
};
export type TriggerRef = {
  close: () => void;
};

export const MyPopupTrigger = forwardRef(function (
  { children, needButton }: TriggerProps,
  ref: Ref<TriggerRef>,
) {
  const {
    refs,
    setIsMounted,
    setIsOpen,
    close,
    toggle,
    state: { isMounted, isOpen },
  } = usePopoverContext();

  useImperativeHandle(ref, () => ({ close }));

  useEffect(() => {
    if (!isMounted) {
      setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  }, [isMounted]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsMounted(true);
      }, 100);
    }

    return () => {
      if (!isOpen) {
        setIsMounted(false);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (
        !refs.contentRef ||
        !refs.triggerRef ||
        refs.triggerRef.current?.contains(e.target as Node) ||
        refs.contentRef.current?.contains(e.target as Node)
      ) {
        return;
      }

      setIsMounted(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isOpen]);

  if (!needButton)
    if (isValidElement(children)) {
      return cloneElement(children, {
        onClick: toggle,
        ref: refs.triggerRef,
      } as HTMLProps<Element>);
    }

  return (
    <button ref={refs.triggerRef} onClick={toggle}>
      {children}
    </button>
  );
});

type ContentProps = {
  children: ReactNode;
  className?: string;
  animationClassName?: string;

  // append to portal prop
  position?: "left-bottom" | "right-bottom";
  origin?: "bottom right" | "bottom left" | "top right" | "top left";
  spacer?: number;
};

export function MyPopupContent(props: ContentProps) {
  const { animationRef } = usePopupContent(props);

  const {
    state: { isMounted, isOpen },
    appendOnPortal,
    setContentRef,
    persist,
  } = usePopoverContext();

  const classes = {
    unMountedContent: "opacity-0 scale-[.95]",
    mountedContent: "opacity-100 scale-[1]",
  };

  const content = (
    <div
      ref={setContentRef}
      className={`${appendOnPortal ? "fixed z-[99]" : "absolute"} ${
        props.className || ""
      }`}
    >
      <div
        ref={animationRef}
        className={` transition-[transform,opacity] duration-[.2s] ease-linear ${
          props.animationClassName || ""
        } ${isMounted ? classes.mountedContent : classes.unMountedContent}`}
      >
        {props.children}
      </div>
    </div>
  );

  if (!isOpen && !persist) return <></>;

  return (
    <>
      {appendOnPortal
        ? createPortal(content, document.getElementById("portals")!)
        : content}
    </>
  );
}

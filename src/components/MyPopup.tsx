import {
  cloneElement,
  createContext,
  ElementRef,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode,
  Ref,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type StateType = {
  isMounted: boolean;
  isOpen: boolean;
};

// context
type PopupProps = {
  isOpenFromParent?: boolean;
  setIsOpenFromParent?: (v: boolean) => void;
  relativeWrap?: boolean;
};

const usePopup = ({ isOpenFromParent, setIsOpenFromParent }: PopupProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const triggerRef = useRef<ElementRef<"button"> | null>(null);
  const contentRef = useRef<ElementRef<"div"> | null>(null);

  const setTriggerRef = (ele: ElementRef<"button">) => {
    triggerRef.current = ele;
  };

  const setContentRef = (ele: ElementRef<"div">) => {
    contentRef.current = ele;
  };

  return {
    refs: { triggerRef, contentRef, setTriggerRef, setContentRef },
    state: { isMounted, isOpen } as StateType,
    isMounted,
    setIsMounted,
    isOpen: isOpen || isOpenFromParent,
    setIsOpen: setIsOpenFromParent || setIsOpen,
  };
};

type ContextType = ReturnType<typeof usePopup>;

const Context = createContext<ContextType | null>(null);

const usePopoverContext = () => {
  const context = useContext(Context);
  if (context == null) {
    throw new Error("Popover components must be wrapped in <MyPopup />");
  }
  return context;
};

export default function MyPopup({
  children,
  relativeWrap = true,
  ...rest
}: { children: ReactNode } & PopupProps) {
  return (
    <Context.Provider value={usePopup(rest)}>
      {relativeWrap ? <div className="relative">{children}</div> : children}
    </Context.Provider>
  );
}

type TriggerProps = {
  children: ReactNode;
  className?: string;
};
export type TriggerRef = {
  close: () => void;
};

export const MyPopupTrigger = forwardRef(function (
  { children }: TriggerProps,
  ref: Ref<TriggerRef>
) {
  const { refs, isMounted, setIsMounted, setIsOpen, isOpen } = usePopoverContext();

  const close = () => {
    setIsMounted(false);
  };

  const toggle = () => {
    if (isMounted) setIsMounted(false);
    if (!isOpen) setIsOpen(true);
  };

  useImperativeHandle(ref, () => ({ close }));

  useEffect(() => {
    if (!isMounted) {
      setTimeout(() => {
        setIsOpen(false);
      }, 400);
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

  if (isValidElement(children)) {
    return cloneElement(children, {
      ref: refs.setTriggerRef,
      onClick: toggle,
      ...children.props,
    } as HTMLProps<Element>);
  }

  return <></>;
});

type ContentProps = {
  children: ReactNode;
  className?: string;
  animationClassName?: string;
};
export function MyPopupContent({
  children,
  className,
  animationClassName,
}: ContentProps) {
  const { isMounted, isOpen, refs } = usePopoverContext();

  const classes = {
    unMountedContent: "opacity-0 scale-[.95]",
    mountedContent: "opacity-100 scale-[1]",
  };

  return (
    <>
      {isOpen && (
        <div className={`absolute ${className}`}>
          <div
            ref={refs.setContentRef}
            className={` transition-[transform,opacity] duration-[.25s] ease-linear ${animationClassName} ${
              isMounted ? classes.mountedContent : classes.unMountedContent
            }`}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}

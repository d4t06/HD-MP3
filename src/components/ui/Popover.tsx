import {
  useFloating,
  autoUpdate,
  offset,
  useClick,
  useDismiss,
  useRole,
  useInteractions,
  Placement,
  FloatingFocusManager,
  useTransitionStyles,
  useTransitionStatus,
} from "@floating-ui/react";
import {
  ReactNode,
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
} from "react";

interface PopoverOptions {
  initialOpen?: boolean;
  placement?: Placement;
  modal?: boolean;
  isOpenFromParent?: boolean;
  setIsOpenFromParent?: (open: boolean) => void;
}

export function usePopover({
  placement = "bottom",
  isOpenFromParent,
  setIsOpenFromParent,
}: PopoverOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);
  const { context, floatingStyles, refs } = useFloating({
    placement,
    open: isOpenFromParent || isOpen,
    onOpenChange: setIsOpenFromParent || setIsOpen,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6)],
  });
  const click = useClick(context);
  const dismiss = useDismiss(context, { escapeKey: false });
  const role = useRole(context);
  const { isMounted, styles } = useTransitionStyles(context, {
    duration: 150,
    initial: {
      opacity: 0,
      transform: "scale(0.8)",
    },
    close: {
      opacity: 0,
      transform: "scale(0.8)",
    },
    open: {
      opacity: 1,
      transform: "scale(1)",
    },
    common: ({ side }) => ({
      transformOrigin: {
        top: "bottom",
        bottom: "top",
        left: "right",
        right: "left",
      }[side],
    }),
  });

  const { getFloatingProps, getReferenceProps } = useInteractions([click, dismiss, role]);

  return {
    isOpen: isOpenFromParent || isOpen,
    setIsOpen: setIsOpenFromParent || setIsOpen,
    getFloatingProps,
    getReferenceProps,
    floatingStyles,
    refs,
    context,
    styles,
    isMounted,
  };
}

const PopoverContext = createContext<ReturnType<typeof usePopover> | null>(null);

const usePopoverContext = () => {
  const context = useContext(PopoverContext);
  if (context == null) {
    throw new Error("Popover components must be wrapped in <Popover />");
  }
  return context;
};

export function Popover({
  children,
  ...restOptions
}: {
  children: ReactNode;
} & PopoverOptions) {
  const popover = usePopover({ ...restOptions });
  return <PopoverContext.Provider value={popover}>{children}</PopoverContext.Provider>;
}

export function PopoverTrigger({
  children,
  className,
  asChild = false,
  ...props
}: {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
}) {
  const { getReferenceProps, refs, isOpen } = usePopoverContext();

  if (asChild && isValidElement(children)) {
    return cloneElement(
      children,
      getReferenceProps({
        ref: refs.setReference,
        ...props,
        ...children.props,
        "data-state": isOpen ? "open" : "closed",
      })
    );
  }

  return (
    <button
      type="button"
      ref={refs.setReference}
      data-state={isOpen ? "open" : "closed"}
      className={`${className ?? ""}`}
      {...getReferenceProps(props)}
    >
      {children}
    </button>
  );
}

export function PopoverContent({
  children,
  className,
  ...props
}: {
  className?: string;
  children: ReactNode;
}) {
  const { context, refs, getFloatingProps, floatingStyles, styles } = usePopoverContext();
  const { isMounted, status } = useTransitionStatus(context);

  // this prevent close animation
  // if (!isOpen) return;

  return (
    <>
      {isMounted && (
        <FloatingFocusManager context={context} modal={false}>
          <div
            ref={refs.setFloating}
            className={`${className || 'z-[20]'}`}
            style={{ ...floatingStyles }}
            {...getFloatingProps(props)}
            data-status={status}
          >
            <div
              style={{
                ...styles,
              }}
            >
              {children}
            </div>
          </div>
        </FloatingFocusManager>
      )}
    </>
  );
}

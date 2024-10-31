import { useTheme } from "@/store";
import {
  cloneElement,
  ElementRef,
  forwardRef,
  HTMLProps,
  isValidElement,
  ReactNode,
  Ref,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePopoverContext } from "./MyPopup";

type PropsFromPopup = {
  onClick?: () => void;
};

type Props = {
  children: ReactNode;
  className?: string;
  position?: string;
  isWrapped?: boolean;
  content: string;
};

function MyToolTip(
  {
    children,
    className = "px-2 py-1 text-sm font-[600]",
    position = "bottom-[calc(100%+8px)]",
    content,
    isWrapped,
    ...rest
  }: Props,
  _ref: Ref<ElementRef<"button">>
) {
  const [open, setOpen] = useState(false);

  const { theme } = useTheme();

  const { setTriggerRef, state } = usePopoverContext();
  const { onClick } = rest as PropsFromPopup;

  const cloneEleRef = useRef<ElementRef<"button">>(null);

  const handleMouseEnter: EventListener = () => {
    setOpen(true);
  };

  const handleMouseLeave: EventListener = () => {
    setOpen(false);
  };

  // const handleTouchEnd: EventListener = (e) => {
  //   e.preventDefault()
  // };

  useEffect(() => {
    const cloneEle = cloneEleRef.current as HTMLButtonElement;

    if (!cloneEle) return;

    if (setTriggerRef) {
      setTriggerRef(cloneEle);
    }

    cloneEle.addEventListener("mouseenter", handleMouseEnter);
    cloneEle.addEventListener("mouseleave", handleMouseLeave);
    // cloneEle.addEventListener("touchend", handleTouchEnd);

    return () => {
      cloneEle.removeEventListener("mouseenter", handleMouseEnter);
      cloneEle.removeEventListener("mouseleave", handleMouseLeave);
      // cloneEle.removeEventListener("touchend", handleTouchEnd);
    };
  }, []);

  const classes = {
    container: `${
      theme.type === "dark" ? "bg-white text-[#333]" : "bg-slate-700 text-white"
    }`,
  };

  const jsxContent = (
    <>
      {isValidElement(children) && (
        <>
          {Object.keys(rest).length
            ? cloneElement(children, {
                ref: cloneEleRef,
                onClick,
              } as HTMLProps<HTMLButtonElement>)
            : cloneElement(children, {
                ref: cloneEleRef,
              } as HTMLProps<HTMLButtonElement>)}

          {!state?.isOpen && open && (
            <div
              className={`${classes.container} absolute whitespace-nowrap -translate-x-1/2 left-1/2 rounded-md ${position} ${className}`}
            >
              {content}
            </div>
          )}
        </>
      )}
    </>
  );

  if (isValidElement(children))
    return <>{isWrapped ? jsxContent : <div className="relative">{jsxContent}</div>}</>;
}

export default forwardRef(MyToolTip);

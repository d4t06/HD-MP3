import {
  ButtonHTMLAttributes,
  ElementRef,
  MouseEventHandler,
  ReactNode,
  Ref,
  forwardRef,
} from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useThemeContext } from "@/stores";

const buttonVariant = cva("inline-flex space-x-1 font-[500] items-center ", {
  variants: {
    variant: {
      default: "",
      circle: "rounded-full",
      list: "flex items-center py-[5px] w-full",
      outline: `border rounded-full`,
      primary: "",
    },
    color: {
      primary: "primary",
      clear: "",
    },
    size: {
      primary: "px-4 py-1.5",
      small: "px-2 py-1",
      half: "w-1/2",
      full: "w-full",
      clear: "",
    },
    rounded: {
      full: "rounded-full",
      md: "rounded-md",
      clear: "",
    },
    hover: {
      default: "hover:brightness-90",
      scale: "transition-transform hover:scale-[1.05]",
      clear: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "primary",
    hover: "default",
    rounded: "full",
    color: "clear",
  },
});

type Props = ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariant> & {
    children: ReactNode;
    isLoading?: boolean;
    onClick?: MouseEventHandler;
    href?: string;
  };

function Button(
  {
    className,
    children,
    variant,
    size,
    disabled,
    isLoading,
    rounded,
    color,
    hover,
    onClick,
    ...props
  }: Props,
  ref: Ref<ElementRef<"button">>,
) {
  const { theme } = useThemeContext();

  return (
    <button
      ref={ref}
      type="button"
      onClick={(e) => (onClick ? onClick(e) : "")}
      {...props}
      className={`${color === "primary" ? theme.content_bg : ""}  ${buttonVariant({ variant, size, hover, rounded, className })}`}
      disabled={isLoading || disabled}
    >
      {isLoading ? <ArrowPathIcon className="w-6 animate-spin" /> : null}
      {!isLoading && children}
    </button>
  );
}

export default forwardRef(Button);

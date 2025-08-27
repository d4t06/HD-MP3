import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, ReactNode, Ref } from "react";
import { Link } from "react-router-dom";

const ButtonVariant = cva("inline-flex relative hover:brightness-95 space-x-1 items-center z-0", {
  variants: {
    variant: {
      primary:
        "before:content-[''] before:absolute before:z-[-1] before:inset-0 active:translate-y-[2px] active:before:shadow-none",
      clear: "before:content-none",
    },
    color: {
      primary:
        "before:border-[#4a826f] text-[#fff] bg-[--primary-cl] before:shadow-[0_2px_0_#4a826f]",
      second:
        "before:border-[#ccc] text-[#333] bg-[#f6f6f6] before:shadow-[0_2px_0_#ccc]",
      clear: "",
    },
    size: {
      primary: "px-5 py-1.5",
      clear: "",
    },
    fontWeight: {
      primary: "font-semibold",
      clear: "",
    },
    border: {
      primary: "before:border-[2px]",
      thin: "before:border-[1px]",
      clear: "before:border-b-[2px]",
    },
    rounded: {
      xl: "before:rounded-xl rounded-xl",
      lg: "before:rounded-lg rounded-lg",
      md: "before:rounded-md rounded-md",
    },
  },
  defaultVariants: {
    variant: "primary",
    color: "primary",
    size: "primary",
    fontWeight: "primary",
    border: "primary",
    rounded: "lg",
  },
});

interface Props extends VariantProps<typeof ButtonVariant> {
  onClick?: () => void;
  loading?: boolean;
  disabled?: boolean;
  active?: boolean;
  type?: HTMLButtonElement["type"];
  href?: string;
  className?: string;
  children: ReactNode;
}

function Button(
  {
    onClick,
    loading,
    children,
    border,
    size,
    color,
    fontWeight,
    type = "button",
    variant,
    disabled,
    rounded,
    className,
    active,
    href,
  }: Props,
  ref: Ref<HTMLButtonElement>
) {
  const _disabled = disabled || loading;

  const activeClasses = "before:shadow-none translate-y-[2px]";

  return (
    <>
      {href ? (
        <Link
          to={href}
          className={`${ButtonVariant({
            variant,
            size,
            color,
            fontWeight,
            rounded,
            border,
            className,
          })} ${active ? activeClasses : ""}`}
        >
          {children}
        </Link>
      ) : (
        <button
          ref={ref}
          type={type || "button"}
          onClick={onClick}
          disabled={_disabled}
          className={`${ButtonVariant({
            variant,
            size,
            color: active ? "primary" : color,
            border,
            fontWeight,
            className,
          })} ${active ? activeClasses : ""}`}
        >
          {loading ? <ArrowPathIcon className="w-6 animate-spin" /> : children}
        </button>
      )}
    </>
  );
}

export default forwardRef(Button);

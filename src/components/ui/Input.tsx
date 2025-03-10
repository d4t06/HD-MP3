import { useThemeContext } from "@/stores";
import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes, Ref } from "react";

const inputVariants = cva("w-full", {
  variants: {
    variant: {
      primary:
        "border border-black/10 placeholder:[#888] outline-none py-1.5 px-2",
      clear: "",
    },
    rounded: {
      xl: "rounded-xl",
      lg: "rounded-lg",
      md: "rounded-md",
    },
  },

  defaultVariants: {
    variant: "primary",
    rounded: "md",
  },
});

type Props = VariantProps<typeof inputVariants> &
  InputHTMLAttributes<HTMLInputElement>;

function Input(
  { variant, className = "", ...rest }: Props,
  ref: Ref<HTMLInputElement>
) {

  const {theme} = useThemeContext()

  return (
    <input
      ref={ref}
      className={`bg-${theme.alpha} ${inputVariants({ variant, className })}`}
      {...rest}
    />
  );
}

export default forwardRef(Input);

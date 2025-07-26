import { cva, VariantProps } from "class-variance-authority";
import { forwardRef, InputHTMLAttributes, Ref } from "react";

export const inputClasses = `border w-full placeholder:[#666] font-medium rounded-md outline-none py-1.5 px-2 ${location.hash.includes("dashboard") ? "bg-black/5 border-black/10" : "bg-white/10 border-white/10"} "`;



const inputVariants = cva("w-full", {
  variants: {
    variant: {
      primary: inputClasses,
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
  ref: Ref<HTMLInputElement>,
) {
  return (
    <input
      ref={ref}
      className={` ${inputVariants({ variant, className })}`}
      {...rest}
    />
  );
}

export default forwardRef(Input);

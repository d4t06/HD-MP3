import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ReferenceType } from "@floating-ui/react";

const buttonVariant = cva("inline-flex items-center hover:brightness-90", {
   variants: {
      variant: {
         default: "",
         circle: "rounded-[99px] p-[4px] justify-center",
         list: "flex items-center py-[5px] w-full text-[14px]",
         primary: "px-[16px] py-[4px] text-[14px]",
         outline: `border rounded-full`,
      },
      size: {
         half: "w-1/2",
         full: "w-full",
         small: "text-[13px] px-[10px] py-[3px]",
         normal: "text-[14px] px-[16px] py-[4px]",
         large: "h-[40px] w-[40px]",
      },
   },
   defaultVariants: {
      variant: "default",
   },
});

interface Props
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariant> {
   children: ReactNode;
   // classNames: any;
   isLoading?: boolean;
   onClick?: MouseEventHandler;
   ref?: (node: ReferenceType | null) => void;
}

const Button: FC<Props> = ({
   className,
   children,
   variant,
   size,
   isLoading,
   onClick,
   ...props
}) => {
   return (
      <button
         type="button"
         onClick={(e) => (onClick ? onClick(e) : "")}
         {...props}
         className={buttonVariant({ variant, size, className })}
         disabled={isLoading}
      >
         {isLoading ? <ArrowPathIcon className="w-[22px] animate-spin" /> : null}
         {!isLoading && children}
      </button>
   );
};

export default Button;

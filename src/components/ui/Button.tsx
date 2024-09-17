import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ReferenceType } from "@floating-ui/react";

const buttonVariant = cva("inline-flex font-[500] items-center ", {
   variants: {
      variant: {
         default: "",
         circle: "rounded-[99px] justify-center",
         list: "flex items-center py-[5px] w-full",
         primary: "px-[16px] py-[4px]",
         outline: `border rounded-full`,
      },
      size: {
         clear: "",
         half: "w-1/2",
         full: "w-full",
         small: "px-[10px] py-[3px]",
         normal: "px-[16px] py-[4px]",
         large: "h-[40px] w-[40px]",
      },
      hover: {
         default: "hover:brightness-90",
         scale: "transition-transform hover:scale-[1.05]",
         clear: "",
      },
   },
   defaultVariants: {
      variant: "default",
      size: "normal",
      hover: "default",
   },
});

interface Props
   extends ButtonHTMLAttributes<HTMLButtonElement>,
      VariantProps<typeof buttonVariant> {
   children: ReactNode;
   isLoading?: boolean;
   onClick?: MouseEventHandler;
   ref?: (node: ReferenceType | null) => void;
}

const Button: FC<Props> = ({
   className,
   children,
   variant,
   size,
   disabled,
   isLoading,
   hover,
   onClick,
   ...props
}) => {
   return (
      <button
         type="button"
         onClick={(e) => (onClick ? onClick(e) : "")}
         {...props}
         className={buttonVariant({ variant, size, hover, className })}
         disabled={isLoading || disabled}
      >
         {isLoading ? (
            <ArrowPathIcon className="w-[22px] animate-spin" />
         ) : null}
         {!isLoading && children}
      </button>
   );
};

export default Button;

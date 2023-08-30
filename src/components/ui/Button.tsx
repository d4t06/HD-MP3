import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ReferenceType } from "@floating-ui/react";

const buttonVariant = cva("inline-flex items-center", {
   variants: {
      variant: {
         default: "hover:brightness-90",
         circle: "rounded-full p-[8px] bg-gray-500 bg-opacity-20 text-xl"
      },
      size: {
         half: "w-1/2",
         full: "w-full",
         small:"h-[20px] w-[20px]",
         normal: "h-[35px] w-[35px]",
         large: "h-[40px] w-[40px]"
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
   onClick?:MouseEventHandler,
   ref?: ((node: ReferenceType | null) => void);

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
      <button onClick={(e) => onClick ? onClick(e) : ''} {...props} className={buttonVariant({variant, size, className})} disabled={isLoading}>
         {isLoading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : null}
         {!isLoading && children}
      </button>
   );
};

export default Button;

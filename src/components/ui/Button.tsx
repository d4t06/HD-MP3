import { ButtonHTMLAttributes, FC, MouseEventHandler, ReactNode } from "react";
import { VariantProps, cva } from "class-variance-authority";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { ReferenceType } from "@floating-ui/react";

const buttonVariant = cva("inline-flex items-center hover:brightness-90", {
   variants: {
      variant: {
         default: '',
         circle: "rounded-[99px] p-[4px] bg-gray-500 bg-opacity-20 text-xl",
         list: 'flex items-center py-[4px] w-full text-[14px]',
         primary: 'px-[20px] py-[5px] text-[14px]'
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

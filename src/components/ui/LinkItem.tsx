import { Link } from "react-router-dom";
import Button from "./Button";
import { useTheme } from "../../store/ThemeContext";
import { ReactNode } from "react";

type Props = {
   className?: string
   icon: ReactNode;
   label: string;
   to: string;
   arrowIcon?: ReactNode;
};

export default function LinkItem({
   className,
   icon,
   label,
   to,
   arrowIcon,
}: Props) {
   const { theme } = useTheme();

   const styleVariants = {
      "#4f46e5": "text-[#4f46e5]",
      "#5a7aa9": "text-[#5a7aa9]",
      "#cd1818": "text-[#cd1818]",
      "#91e159": "text-[#91e159]",
   };

   const key = theme as keyof typeof styleVariants;

   const iconClasses = `w-6 h-6 mr-2 inline ${styleVariants[key]}`;

   return (
      <Link
         className={"w-full flex flex-row justify-between items-center " + className}
         to={to}
      >
         <Button className="">
            {icon}
            <span className="text-lg font-medium">
               {label}
            </span>
         </Button>

         {arrowIcon && <span>{arrowIcon}</span>}
      </Link>
   );
}

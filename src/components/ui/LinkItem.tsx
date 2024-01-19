import { Link } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
   className?: string;
   icon: ReactNode;
   label: string;
   to?: string;
   arrowIcon?: ReactNode;
   onClick?: () => void;
   children?: ReactNode;
};

export default function LinkItem({ className, icon, label, to, arrowIcon, children, onClick }: Props) {
   if (to)
      return (
         <Link className={"w-full flex flex-row justify-between items-center " + className} to={to}>
            <div className="inline-flex">
               {icon}
               <span className="text-lg font-medium">{label}</span>
            </div>
            {/* <Button className="">
         </Button> */}

            {children}
            {arrowIcon && <span>{arrowIcon}</span>}
         </Link>
      );
   else if (onClick)
      return (
         <button onClick={onClick} className={"w-full flex flex-row justify-between items-center " + className}>
            <p className="inline-flex">
               {icon}
               <span className="text-lg font-medium">{label}</span>
            </p>
            {/* <Button className="">
         </Button> */}
         </button>
      );
   else return <p>No onClick</p>;
}

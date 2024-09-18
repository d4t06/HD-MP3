import { Link } from "react-router-dom";
import { ReactNode } from "react";

type Props = {
  className?: string;
  icon: ReactNode;
  label: string;
  to?: string;
  arrowIcon?: ReactNode;
  children?: ReactNode;
};

export default function LinkItem({
  className,
  icon,
  label,
  to,
  arrowIcon,
  children,
}: Props) {
  if (to)
    return (
      <Link className={`w-full flex  justify-between  ${className}`} to={to}>
        <div className="inline-flex items-center ">
          {icon}
          <span className="text-lg font-medium">{label}</span>
        </div>

        {children}
        {arrowIcon && <span>{arrowIcon}</span>}
      </Link>
    );
  else return <p>No onClick</p>;
}

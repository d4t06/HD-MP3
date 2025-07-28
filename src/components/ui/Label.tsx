import { ReactNode } from "react";

type Props = {
  htmlFor?: string;
  className?: string;
  children: ReactNode;
};

export default function Label({ children, className = "", htmlFor }: Props) {
  const classes = `${location.hash.includes("dashboard") ? "text-gray-600" : "text-gray-300"} font-semibold ${className}`;

  if (htmlFor)
    return (
      <label className={classes} htmlFor={htmlFor}>
        {children}
      </label>
    );

  return <p className={classes}>{children}</p>;
}

import { ReactNode } from "react";

type Props = {
  colList: string[];
  children: ReactNode;
  className?: string;
};

function Table({ colList, children, className = "" }: Props) {
  const classes = {
    table: "w-full",
  };

  return (
    <table className={`${classes.table} ${className}`}>
      <thead>
        <tr className="no-hover">
          {colList.map((item, index) => (
            <th key={index}>{item}</th>
          ))}
        </tr>
      </thead>

      <tbody>{children}</tbody>
    </table>
  );
}

export default Table;

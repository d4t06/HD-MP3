import { Table } from "@/components";
import { Frame } from ".";
import { ComponentProps } from "react";

export default function DashboardTable({
  className = "",
  children,
  ...props
}: ComponentProps<typeof Table>) {
  return (
    <Frame>
      <div className={`rounded-md overflow-hidden`}>
        <Table
          className={`[&_td]:text-sm hover:[&_tr]:bg-black/5 [&_tbody>tr]:border-t [&_tr]:border-black/5 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 ${className}`}
          {...props}
        >
          {children}
        </Table>
      </div>
    </Frame>
  );
}

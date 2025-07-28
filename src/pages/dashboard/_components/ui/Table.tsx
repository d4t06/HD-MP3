import { Table } from "@/components";
import { Frame } from ".";
import { ComponentProps } from "react";

export default function DashboardTable({
  className = "",
  children,
  ...props
}: ComponentProps<typeof Table>) {
  return (
    <Frame className="overflow-x-auto w-full">
      <div className={`rounded-md overflow-hidden`}>
        <Table
          className={`[&_td]:text-sm hover:[&_tr:not(.no-hover)]:bg-black/5 [&_tbody_tr:not(.no-hover)]:border-t [&_tr]:border-black/5 [&_th]:text-sm [&_th]:text-left [&_td]:p-2 [&_th]:p-2 [&_th]:font-semibold [&_th]:text-[#333]  ${className}`}
          {...props}
        >
          {children}
        </Table>
      </div>
    </Frame>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { Table } from "react-bootstrap";

function TableTemplate({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Table size="sm" className={className} hover>
      {children}
    </Table>
  );
}

function ListViewHeader({
  children,
  sticky,
}: {
  children: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <thead className={`${sticky ? "sticky-top" : ""}`} style={{ zIndex: 1 }}>
      <tr>{children}</tr>
    </thead>
  );
}

function ListViewColumn({
  children,
  className,
  name,
}: {
  children: React.ReactNode;
  className?: string;
  name: string;
}) {
  return (
    <th
      title={name}
      className={`text-capitalize text-nowrap ${className} fw-bold`}
    >
      {children}
    </th>
  );
}

function ListViewContent({ children }: { children: React.ReactNode }) {
  return <tbody>{children}</tbody>;
}

export function ListItemLink({
  children,
  path,
}: {
  children: React.ReactNode;
  path: string;
}) {
  const router = useRouter();
  return (
    <tr
      style={{ cursor: "pointer", userSelect: "none" }}
      onDoubleClick={() => router.push(path)}
    >
      {children}
    </tr>
  );
}

export function ListItem({
  children,
  className,
  name,
}: {
  children: React.ReactNode;
  className?: string;
  name: string;
}) {
  return (
    <td valign="middle" title={name} className={`text-nowrap ${className}`}>
      {children}
    </td>
  );
}

TableTemplate.Header = ListViewHeader;
TableTemplate.Column = ListViewColumn;
TableTemplate.Content = ListViewContent;

export default TableTemplate;

import * as React from "react";
import { Tag } from "antd";
import { ColumnProps, SorterResult } from "antd/lib/table";

export function renderWithTags(
  value: string,
  entries: Record<string, { text: string; color: string }>
) {
  return entries[value] ? (
    <Tag color={entries[value].color}>{entries[value].text}</Tag>
  ) : (
    <Tag>{value}</Tag>
  );
}

export function sortByString<T>(
  dataIndex: string,
  sortInfo?: SorterResult<T>
): ColumnProps<T> {
  return {
    sorter: (a: T, b: T) => a[dataIndex]?.localeCompare(b[dataIndex]),
    sortOrder: sortInfo?.columnKey === dataIndex && sortInfo.order
  };
}

export function sortByNumber<T>(
  dataIndex: string,
  sortInfo?: SorterResult<T>
): ColumnProps<T> {
  return {
    sorter: (a: T, b: T) => a[dataIndex] - b[dataIndex],
    sortOrder: sortInfo?.columnKey === dataIndex && sortInfo.order
  };
}

export function parseJsonOrDefault<T>(json: string | null, defaultValue: T) {
  if (!json) return defaultValue;

  try {
    return JSON.parse(json);
  } catch {
    return defaultValue;
  }
}

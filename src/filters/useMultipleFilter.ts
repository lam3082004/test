import * as React from "react";
import { ColumnProps } from "antd/lib/table";
import { FilterEntries, getFilters } from "./filters";

interface Props {
  dataIndex: string;
  filterEntries?: FilterEntries;
}

interface ReturnValue<T> {
  columnProps: ColumnProps<T>;
  handleFilterChange: (filters: Record<string, string[]>) => void;
  resetFilter: () => void;

  // manual manipulation of filter content
  filter: React.ReactText[] | undefined;
  setFilter: (filter: React.ReactText[] | undefined) => void;
}

export default function useMultipleFilter<T>({
  dataIndex,
  filterEntries
}: Props): ReturnValue<T> {
  const [filter, setFilter] = React.useState<React.ReactText[]>();

  const handleFilterChange = React.useCallback(
    (filters: Record<string, string[]>): void => {
      const value = filters[dataIndex];
      setFilter(value?.length ? value : undefined);
    },
    [dataIndex]
  );

  const resetFilter = React.useCallback((): void => {
    setFilter(undefined);
  }, []);

  return {
    handleFilterChange,
    resetFilter,
    filter,
    setFilter,
    columnProps: {
      dataIndex,
      key: dataIndex,
      filters: filterEntries ? getFilters(filterEntries) : undefined,
      filtered: !!filter,
      filteredValue: filter || [],
      onFilter: (value: string, data: T) => data[dataIndex] === value
    }
  };
}

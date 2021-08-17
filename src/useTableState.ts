import { PaginationConfig, SorterResult } from "antd/lib/table";
import * as React from "react";
import { parseJsonOrDefault } from "./helpers";

interface ReturnValue<T> {
  pagination: PaginationConfig;
  setPagination: (config: PaginationConfig) => void;

  sortInfo: SorterResult<T> | undefined;
  setSortInfo: (sorterResult: SorterResult<T>) => void;

  handleChange: (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<T>
  ) => void;
  resetAllFilters: () => void;
}

interface Filter {
  handleFilterChange: (filters: Record<string, string[]>) => void;
  resetFilter: () => void;

  // manual manipulation of filter content
  filter: any;
  setFilter: (filter: any) => void;
}

interface Props {
  filtersList: Filter[];
  localStorageRootKeyName?: string;
}

const getStoragePaginationKey = (root: string) => `DEMO.${root}.pagination`;
const getStorageSorterKey = (root: string) => `DEMO.${root}.sorter`;

// for demo we put 5, in reality should not set
const DEFAULT_PAGINATION_VALUE: PaginationConfig = { pageSize: 5 };

export default function useTableState<T>({
  filtersList,
  localStorageRootKeyName
}: Props): ReturnValue<T> {
  const [pagination, setPagination] = React.useState<PaginationConfig>(
    DEFAULT_PAGINATION_VALUE
  );
  const [sortInfo, setSortInfo] = React.useState<SorterResult<T>>();

  // ==== STATE HELPER METHODS ====
  const handleChange = (
    pagination: PaginationConfig,
    filters: any,
    sorter: SorterResult<T>
  ): void => {
    setPagination(pagination);
    filtersList.forEach((filter) => filter.handleFilterChange(filters));
    setSortInfo(sorter);
  };

  const resetAllFilters = (): void => {
    filtersList.forEach((filter) => filter.resetFilter());
    setSortInfo(undefined);
  };

  // ==== REMEMBER & RESTORE TABLE STATES ====
  // TODO: Does not work on filters atm
  // TODO: This can probably be refactored to a useLocalStorage()
  const [restoreDone, setRestoreDone] = React.useState(false);
  React.useEffect((): void => {
    if (localStorageRootKeyName && restoreDone) {
      window.localStorage.setItem(
        getStoragePaginationKey(localStorageRootKeyName),
        JSON.stringify(pagination)
      );
      window.localStorage.setItem(
        getStorageSorterKey(localStorageRootKeyName),
        JSON.stringify(sortInfo)
      );
    }
  }, [pagination, sortInfo, localStorageRootKeyName, restoreDone]);

  React.useEffect((): void => {
    if (localStorageRootKeyName) {
      setPagination(
        parseJsonOrDefault(
          window.localStorage.getItem(
            getStoragePaginationKey(localStorageRootKeyName)
          ),
          DEFAULT_PAGINATION_VALUE
        )
      );
      setSortInfo(
        parseJsonOrDefault(
          window.localStorage.getItem(
            getStorageSorterKey(localStorageRootKeyName)
          ),
          {}
        )
      );
    }
    setRestoreDone(true);
  }, [localStorageRootKeyName]);

  return {
    pagination,
    setPagination,
    sortInfo,
    setSortInfo,
    handleChange,
    resetAllFilters
  };
}

import { Button, Icon, Input } from "antd";
import { ColumnProps } from "antd/lib/table";
import * as React from "react";
import Highlighter from "react-highlight-words";
import useSingleFilter from "./useSingleFilter";

interface Props {
  dataIndex: string;
}

function noop() {}

interface ReturnValue<T> {
  columnProps: ColumnProps<T>;
  handleFilterChange: (filters: Record<string, string[]>) => void;
  resetFilter: () => void;

  // manual manipulation of filter content
  filter: React.ReactText | undefined;
  setFilter: (filter: React.ReactText | undefined) => void;
}

export default function useSearchFilter<T>({
  dataIndex
}: Props): ReturnValue<T> {
  const {
    columnProps: filterColumnProps,
    handleFilterChange,
    resetFilter,
    filter,
    setFilter
  } = useSingleFilter<T>({ dataIndex });

  const inputRef = React.useRef<Input>();

  const handleSearch = React.useCallback(
    (selectedKeys: React.ReactText[], confirm: () => void): void => {
      confirm();
      setFilter(selectedKeys[0]);
    },
    [setFilter]
  );

  const handleReset = React.useCallback(
    (clearFilters: () => void): void => {
      clearFilters();
      resetFilter();
    },
    [resetFilter]
  );

  return {
    handleFilterChange,
    resetFilter,
    filter,
    setFilter,
    columnProps: {
      ...filterColumnProps,
      filterDropdown: ({
        setSelectedKeys = noop,
        selectedKeys = [],
        confirm = noop,
        clearFilters = noop
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={inputRef}
            placeholder={`Search ${dataIndex}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() => handleSearch(selectedKeys, confirm)}
            style={{ width: 188, marginBottom: 8, display: "block" }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm)}
            icon="search"
            size="small"
            style={{ width: 90, marginRight: 8 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </div>
      ),
      filterIcon: (filtered) => (
        <Icon
          type="search"
          style={{ color: filtered ? "#1890ff" : undefined }}
        />
      ),
      onFilter: (value, record) =>
        !value ||
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase()),
      onFilterDropdownVisibleChange: (visible) => {
        if (visible) {
          setTimeout(() => inputRef?.current?.select());
        }
      },
      render: (text) =>
        filter ? (
          <Highlighter
            searchWords={[filter]}
            autoEscape
            textToHighlight={text.toString()}
          />
        ) : (
          text
        )
    }
  };
}

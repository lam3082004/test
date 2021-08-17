import * as React from "react";
import "./styles.css";
import "antd/dist/antd.css";
import { Button, Table } from "antd";
import { ColumnProps } from "antd/lib/table";
import { renderWithTags, sortByNumber, sortByString } from "./helpers";
import useData, { Data, Group, Gender } from "./useData";
import useTableState from "./useTableState";
import useSearchFilter from "./filters/useSearchFilter";
import useSingleFilter from "./filters/useSingleFilter";
import useMultipleFilter from "./filters/useMultipleFilter";

export const groupRender = {
  [Group.Apple]: { text: "Apple", color: "green" },
  [Group.Peach]: { text: "Peach", color: "magenta" },
  [Group.Orange]: { text: "Orange", color: "orange" }
};

export const genderRender = {
  [Gender.Male]: { text: "Male" },
  [Gender.Female]: { text: "Female" },
  [Gender.Unspecified]: { text: "Unspecified" }
};

export default function App() {
  //// ==== FILTERS ====
  const nameColFilter = useSearchFilter<Data>({ dataIndex: "name" });
  const groupColFilter = useMultipleFilter<Data>({
    dataIndex: "group",
    filterEntries: groupRender
  });
  const genderColFilter = useSingleFilter<Data>({
    dataIndex: "gender",
    filterEntries: genderRender
  });

  //// ==== TABLE STATE ====
  // ## NO SAVING
  const localStorageRootKeyName = undefined;

  // ## WITH SAVING
  // const localStorageRootKeyName = "code-storm";

  const { pagination, sortInfo, handleChange, resetAllFilters } = useTableState<
    Data
  >({
    filtersList: [nameColFilter, groupColFilter, genderColFilter],
    localStorageRootKeyName
  });

  //// ==== BACKEND API ====
  // ## WHEN BACKEND DOESN'T HAVE FILTER
  const data = useData();

  // ## WHEN BACKEND HAVE FILTER
  /*
  const data = useData({
    nameMatch: nameColFilter.filter as string,
    groupMatch: groupColFilter.filter as string[],
    genderMatch: genderColFilter.filter as string
  });
  */

  //// ==== RENDERING ====
  const columns: ColumnProps<Data>[] = [
    {
      title: "ID",
      dataIndex: "key"
    },
    {
      title: "Name",
      dataIndex: "name",
      ...sortByString("name", sortInfo),
      ...nameColFilter.columnProps
    },
    {
      title: "Age",
      dataIndex: "age",
      ...sortByNumber("age", sortInfo)
    },
    {
      title: "Group",
      dataIndex: "group",
      ...groupColFilter.columnProps,
      render: (value: Group) => renderWithTags(value, groupRender)
    },
    {
      title: "Gender",
      dataIndex: "gender",
      ...genderColFilter.columnProps,
      render: (value: Gender) => <>{genderRender[value]?.text || value}</>
    }
  ];

  return (
    <>
      <h1>My little Bobby table</h1>
      <Button type="primary" icon="redo" onClick={resetAllFilters}>
        Reset All Filters
      </Button>
      <Table
        columns={columns}
        dataSource={data}
        onChange={handleChange}
        pagination={pagination}
      />
    </>
  );
}

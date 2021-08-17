import * as React from "react";

export enum Group {
  Apple = "apple",
  Peach = "peach",
  Orange = "orange"
}

export enum Gender {
  Male = "M",
  Female = "F",
  Unspecified = "U"
}

export interface Data {
  key: number;
  name: string;
  age: number;
  group: Group;
  gender: Gender;
}

const entireDataset: Data[] = [
  {
    key: 0,
    name: "Nelson",
    age: 5,
    group: Group.Apple,
    gender: Gender.Male
  },
  {
    key: 1,
    name: "Adam",
    age: 10,
    group: Group.Peach,
    gender: Gender.Male
  },
  {
    key: 2,
    name: "Alice",
    age: 11,
    group: Group.Peach,
    gender: Gender.Female
  },
  {
    key: 3,
    name: "Jane",
    age: 8,
    group: Group.Orange,
    gender: Gender.Female
  },
  {
    key: 4,
    name: "John",
    age: 14,
    group: Group.Apple,
    gender: Gender.Male
  },
  {
    key: 5,
    name: "Some Japanese anime character",
    age: 9000,
    group: Group.Orange,
    gender: Gender.Unspecified
  }
];

export interface Query {
  nameMatch: string;
  groupMatch: string[];
  genderMatch: string;
}

export default function useData(query?: Query): Data[] {
  const [data, setData] = React.useState<Data[]>(entireDataset);

  React.useEffect((): void => {
    if (query) {
      const { nameMatch, groupMatch, genderMatch } = query;
      const filteredDataset = entireDataset
        .filter(
          (data) =>
            !nameMatch ||
            data.name.toLowerCase().includes(nameMatch.toLowerCase())
        )
        .filter(
          (data) => !groupMatch?.length || groupMatch.includes(data.group)
        )
        .filter((data) => !genderMatch || data.gender === genderMatch);
      setData(filteredDataset);
    } else {
      setData(entireDataset);
    }
  }, [query?.nameMatch, query?.groupMatch, query?.genderMatch]);
  return data;
}

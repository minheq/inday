import { makeDocument, makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import { getListViewGroupRows, getListViewLeafRows } from "./list_view_map";

describe("getListViewGroupRows", () => {
  test("grouped 1 level", () => {
    const result = getListViewGroupRows(
      [
        {
          type: "leaf",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          children: [makeDocument({}), makeDocument({})],
        },
        {
          type: "leaf",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [makeDocument({}), makeDocument({})],
        },
      ],
      []
    );

    expect(result[0].path).toEqual([0]);
    expect(result[0].value).toEqual("group1");
    expect(result[1].path).toEqual([1]);
    expect(result[1].value).toEqual("group2");
  });

  test("grouped 2 level", () => {
    const result = getListViewGroupRows(
      [
        {
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          children: [
            {
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [
            {
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ],
      []
    );

    expect(result[0].path).toEqual([0]);
    expect(result[0].value).toEqual("group1");
    expect(result[1].path).toEqual([0, 0]);
    expect(result[1].value).toEqual("group11");
    expect(result[2].path).toEqual([1]);
    expect(result[2].value).toEqual("group2");
    expect(result[3].path).toEqual([1, 0]);
    expect(result[3].value).toEqual("group21");
  });
});

describe("getListViewLeafRows", () => {
  test("flat", () => {
    const result = getListViewLeafRows(
      [
        {
          type: "flat",
          children: [makeDocument({}), makeDocument({})],
        },
      ],
      [],
      0
    );

    expect(result[0].path).toEqual([0]);
    expect(result[0].index).toEqual(0);
    expect(result[1].path).toEqual([0]);
    expect(result[1].index).toEqual(1);
  });

  test("grouped 1 level", () => {
    const result = getListViewLeafRows(
      [
        {
          type: "leaf",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          children: [makeDocument({}), makeDocument({})],
        },
        {
          type: "leaf",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [makeDocument({}), makeDocument({})],
        },
      ],
      [],
      0
    );

    expect(result[0].path).toEqual([0]);
    expect(result[0].index).toEqual(0);
    expect(result[1].path).toEqual([0]);
    expect(result[1].index).toEqual(1);
    expect(result[2].path).toEqual([1]);
    expect(result[2].index).toEqual(2);
    expect(result[3].path).toEqual([1]);
    expect(result[3].index).toEqual(3);
  });

  test("grouped 2 level", () => {
    const result = getListViewLeafRows(
      [
        {
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          children: [
            {
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [
            {
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ],
      [],
      0
    );

    console.log(result);

    expect(result[0].path).toEqual([0, 0]);
    expect(result[0].index).toEqual(0);
    expect(result[1].path).toEqual([0, 0]);
    expect(result[1].index).toEqual(1);
    expect(result[2].path).toEqual([1, 0]);
    expect(result[2].index).toEqual(2);
    expect(result[3].path).toEqual([1, 0]);
    expect(result[3].index).toEqual(3);
  });
});

import { makeDocument, makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import { getListViewGroupRows } from "./list_view_map";

describe("getListViewGroupRows", () => {
  test("1 level nested nodes", () => {
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

  test("2 level nested nodes", () => {
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

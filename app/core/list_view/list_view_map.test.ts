import { FlatObject } from "../../../lib/flat_object";
import { makeDocument, makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import { getListViewGroupRows, getListViewLeafRows } from "./list_view_map";
import { ListViewNodes } from "./list_view_nodes";
import { CollapsedGroups } from "./list_view_view";

describe("getListViewGroupRows", () => {
  describe("grouped 1 level", () => {
    const nodes: ListViewNodes = [
      {
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group1",
        children: [makeDocument({}), makeDocument({})],
      },
      {
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group2",
        children: [makeDocument({}), makeDocument({})],
      },
    ];

    test("expanded", () => {
      const result = getListViewGroupRows(nodes, []);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(false);
      expect(result[0].value).toEqual("group1");
      expect(result[1].path).toEqual([1]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group2");
    });

    test("1 group collapsed", () => {
      const collapsedGroups: CollapsedGroups = FlatObject();
      collapsedGroups.set([0], true);
      const result = getListViewGroupRows(nodes, [], collapsedGroups);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(true);
      expect(result[0].value).toEqual("group1");
      expect(result[1].path).toEqual([1]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group2");
    });
  });

  describe("grouped 2 level", () => {
    const nodes: ListViewNodes = [
      {
        type: "ancestor",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group1",
        children: [
          {
            type: "leaf",
            field: makeField({ type: FieldType.SingleLineText }),
            value: "group11",
            children: [makeDocument({}), makeDocument({})],
          },
        ],
      },
      {
        type: "ancestor",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group2",
        children: [
          {
            type: "leaf",
            field: makeField({ type: FieldType.SingleLineText }),
            value: "group21",
            children: [makeDocument({}), makeDocument({})],
          },
        ],
      },
    ];

    test("expanded", () => {
      const result = getListViewGroupRows(nodes, []);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(false);
      expect(result[0].value).toEqual("group1");
      expect(result[1].path).toEqual([0, 0]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group11");
      expect(result[2].path).toEqual([1]);
      expect(result[2].collapsed).toEqual(false);
      expect(result[2].value).toEqual("group2");
      expect(result[3].path).toEqual([1, 0]);
      expect(result[3].collapsed).toEqual(false);
      expect(result[3].value).toEqual("group21");
    });

    test("parent and child group collapsed", () => {
      const collapsedGroups: CollapsedGroups = FlatObject();
      collapsedGroups.set([0], true);
      collapsedGroups.set([1, 0], true);
      const result = getListViewGroupRows(nodes, [], collapsedGroups);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(true);
      expect(result[0].value).toEqual("group1");

      expect(result[1].path).toEqual([0, 0]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group11");

      expect(result[2].path).toEqual([1]);
      expect(result[2].collapsed).toEqual(false);
      expect(result[2].value).toEqual("group2");

      expect(result[3].path).toEqual([1, 0]);
      expect(result[3].collapsed).toEqual(true);
      expect(result[3].value).toEqual("group21");
    });
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

  describe("grouped 1 level", () => {
    const nodes: ListViewNodes = [
      {
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group1",
        children: [makeDocument({}), makeDocument({})],
      },
      {
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group2",
        children: [makeDocument({}), makeDocument({})],
      },
    ];

    test("expanded", () => {
      const result = getListViewLeafRows(nodes, [], 0);

      expect(result[0].path).toEqual([0]);
      expect(result[0].index).toEqual(0);
      expect(result[1].path).toEqual([0]);
      expect(result[1].index).toEqual(1);
      expect(result[2].path).toEqual([1]);
      expect(result[2].index).toEqual(2);
      expect(result[3].path).toEqual([1]);
      expect(result[3].index).toEqual(3);
    });
  });

  describe("grouped 2 level", () => {
    const nodes: ListViewNodes = [
      {
        type: "ancestor",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group1",
        children: [
          {
            type: "leaf",
            field: makeField({ type: FieldType.SingleLineText }),
            value: "group11",
            children: [makeDocument({}), makeDocument({})],
          },
        ],
      },
      {
        type: "ancestor",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group2",
        children: [
          {
            type: "leaf",
            field: makeField({ type: FieldType.SingleLineText }),
            value: "group21",
            children: [makeDocument({}), makeDocument({})],
          },
          {
            type: "leaf",
            field: makeField({ type: FieldType.SingleLineText }),
            value: "group22",
            children: [makeDocument({}), makeDocument({})],
          },
        ],
      },
    ];

    test("expanded", () => {
      const result = getListViewLeafRows(nodes, [], 0);

      expect(result[0].path).toEqual([0, 0]);
      expect(result[0].index).toEqual(0);
      expect(result[1].path).toEqual([0, 0]);
      expect(result[1].index).toEqual(1);
      expect(result[2].path).toEqual([1, 0]);
      expect(result[2].index).toEqual(2);
      expect(result[3].path).toEqual([1, 0]);
      expect(result[3].index).toEqual(3);
      expect(result[4].path).toEqual([1, 1]);
      expect(result[4].index).toEqual(4);
      expect(result[5].path).toEqual([1, 1]);
      expect(result[5].index).toEqual(5);
    });

    test("parent and child group collapsed", () => {
      const collapsedGroups: CollapsedGroups = FlatObject();
      collapsedGroups.set([0], true);
      collapsedGroups.set([1, 0], true);
      const result = getListViewLeafRows(nodes, [], 0, collapsedGroups);

      expect(result[0].path).toEqual([1, 1]);
      expect(result[0].index).toEqual(0);
      expect(result[1].path).toEqual([1, 1]);
      expect(result[1].index).toEqual(1);
    });
  });
});

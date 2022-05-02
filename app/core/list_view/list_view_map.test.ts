import { makeDocument, makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import { getListViewGroupRows, getListViewLeafRows } from "./list_view_map";
import { ListViewDocumentNodes } from "./list_view_nodes";

describe("getListViewGroupRows", () => {
  describe("grouped 1 level", () => {
    test("expanded", () => {
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "leaf",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: false,
          children: [makeDocument({}), makeDocument({})],
        },
        {
          path: [1],
          type: "leaf",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          collapsed: false,
          children: [makeDocument({}), makeDocument({})],
        },
      ];

      const result = getListViewGroupRows(nodes);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(false);
      expect(result[0].value).toEqual("group1");
      expect(result[1].path).toEqual([1]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group2");
    });

    test("1 group collapsed", () => {
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "leaf",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: true,
          children: [makeDocument({}), makeDocument({})],
        },
        {
          path: [1],
          type: "leaf",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          collapsed: false,
          children: [makeDocument({}), makeDocument({})],
        },
      ];

      const result = getListViewGroupRows(nodes);

      expect(result[0].path).toEqual([0]);
      expect(result[0].collapsed).toEqual(true);
      expect(result[0].value).toEqual("group1");
      expect(result[1].path).toEqual([1]);
      expect(result[1].collapsed).toEqual(false);
      expect(result[1].value).toEqual("group2");
    });
  });

  describe("grouped 2 level", () => {
    test("expanded", () => {
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: false,
          children: [
            {
              path: [0, 0],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          path: [1],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          collapsed: false,
          children: [
            {
              path: [1, 0],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ];
      const result = getListViewGroupRows(nodes);

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
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: true,
          children: [
            {
              path: [0, 0],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          path: [1],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          collapsed: false,
          children: [
            {
              path: [1, 0],
              type: "leaf",
              collapsed: true,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ];
      const result = getListViewGroupRows(nodes);

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
          path: [0],
          type: "flat",
          children: [makeDocument({}), makeDocument({})],
        },
      ],
      0
    );

    expect(result[0].path).toEqual([0]);
    expect(result[0].index).toEqual(0);
    expect(result[1].path).toEqual([0]);
    expect(result[1].index).toEqual(1);
  });

  describe("grouped 1 level", () => {
    const nodes: ListViewDocumentNodes = [
      {
        path: [0],
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group1",
        collapsed: false,
        children: [makeDocument({}), makeDocument({})],
      },
      {
        path: [1],
        type: "leaf",
        field: makeField({ type: FieldType.SingleLineText }),
        value: "group2",
        collapsed: false,
        children: [makeDocument({}), makeDocument({})],
      },
    ];

    test("expanded", () => {
      const result = getListViewLeafRows(nodes, 0);

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
    test("expanded", () => {
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: false,
          children: [
            {
              path: [0, 0],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          path: [1],
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [
            {
              path: [1, 0],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
            {
              path: [1, 1],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group22",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ];
      const result = getListViewLeafRows(nodes, 0);

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
      const nodes: ListViewDocumentNodes = [
        {
          path: [0],
          type: "ancestor",
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group1",
          collapsed: true,
          children: [
            {
              path: [0, 1],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group11",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
        {
          path: [1],
          type: "ancestor",
          collapsed: false,
          field: makeField({ type: FieldType.SingleLineText }),
          value: "group2",
          children: [
            {
              path: [1, 0],
              type: "leaf",
              collapsed: true,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group21",
              children: [makeDocument({}), makeDocument({})],
            },
            {
              path: [1, 1],
              type: "leaf",
              collapsed: false,
              field: makeField({ type: FieldType.SingleLineText }),
              value: "group22",
              children: [makeDocument({}), makeDocument({})],
            },
          ],
        },
      ];
      const result = getListViewLeafRows(nodes, 0);

      expect(result[0].path).toEqual([1, 1]);
      expect(result[0].index).toEqual(0);
      expect(result[1].path).toEqual([1, 1]);
      expect(result[1].index).toEqual(1);
    });
  });
});

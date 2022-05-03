import { makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import {
  buildCollapsedFieldValuesTree,
  CollapsedGroupsCache,
} from "./collapsed_groups_cache";

const textField = makeField({ type: FieldType.SingleLineText });
const numberField = makeField({ type: FieldType.Number });

describe("buildCollapsedFieldValuesTree", () => {
  test("works", () => {
    const tree = buildCollapsedFieldValuesTree([
      [textField, "a", true, [[numberField, 2, true]]],
      [textField, "b", false, [[numberField, 1, true]]],
      [
        textField,
        "c",
        false,
        [
          [numberField, 1, false],
          [numberField, 2, true],
        ],
      ],
    ]);

    expect(tree).toMatchObject({
      a: {
        collapsed: true,
        children: {
          2: {
            collapsed: true,
          },
        },
      },
      b: {
        collapsed: false,
        children: {
          1: {
            collapsed: true,
          },
        },
      },
      c: {
        collapsed: false,
        children: {
          1: {
            collapsed: false,
          },
          2: {
            collapsed: true,
          },
        },
      },
    });
  });
});

describe("CollapsedGroupsCache", () => {
  test("parent", () => {
    let cg = CollapsedGroupsCache([]);
    cg = cg.set([[textField, "a", true]]);

    const collapsedGroup = cg.get(textField, "a");
    if (collapsedGroup === undefined) {
      throw new Error("Expected collapsed group to exist");
    }
    expect(collapsedGroup.collapsed).toBeTruthy();
    expect(collapsedGroup.children).toBeFalsy();
  });

  test("child", () => {
    let cg = CollapsedGroupsCache([]);
    cg = cg.set([[textField, "b", false, [[numberField, 1, true]]]]);

    const collapsedGroup = cg.get(textField, "b");
    if (collapsedGroup === undefined) {
      throw new Error("Expected collapsed group to exist");
    }
    expect(collapsedGroup.collapsed).toBeFalsy();
    if (collapsedGroup.children === undefined) {
      throw new Error("Expected collapsed group to have children");
    }
    const collapsedGroupChild = collapsedGroup.children.get(numberField, 1);
    if (collapsedGroupChild === undefined) {
      throw new Error("Expected collapsed group to exist");
    }
    expect(collapsedGroupChild.collapsed).toBeTruthy();
  });

  test("children then parent", () => {
    let cg = CollapsedGroupsCache([]);
    cg = cg.set([[textField, "c", false, [[numberField, 1, true]]]]);
    cg = cg.set([[textField, "c", false, [[numberField, 2, true]]]]);
    cg = cg.set([[textField, "c", true]]);
    const collapsedGroup = cg.get(textField, "c");
    if (collapsedGroup === undefined) {
      throw new Error("Expected collapsed group to exist");
    }

    expect(collapsedGroup.collapsed).toBeTruthy();
    if (collapsedGroup.children === undefined) {
      throw new Error("Expected collapsed group to have children");
    }
    const collapsedGroupChild1 = collapsedGroup.children.get(numberField, 1);
    if (collapsedGroupChild1 === undefined) {
      throw new Error("Expected collapsed group to exist");
    }
    expect(collapsedGroupChild1.collapsed).toBeTruthy();
    const collapsedGroupChild2 = collapsedGroup.children.get(numberField, 2);
    if (collapsedGroupChild2 === undefined) {
      throw new Error("Expected collapsed group to exist");
    }
    expect(collapsedGroupChild2.collapsed).toBeTruthy();
  });
});

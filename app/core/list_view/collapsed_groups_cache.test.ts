import { makeField } from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import {
  buildCollapsedFieldValuesTree,
  CollapsedGroupsCache,
} from "./collapsed_groups_cache";

describe("CollapsedGroupsCache", () => {
  const textField = makeField({ type: FieldType.SingleLineText });
  const numberField = makeField({ type: FieldType.Number });

  describe("buildCollapsedFieldValuesTree", () => {
    test("should build correct tree", () => {
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

  describe("using set", () => {
    let cg = CollapsedGroupsCache([]);
    cg = cg.set([[textField, "a", true, [[numberField, 2, true]]]]);
    cg = cg.set([[textField, "b", false, [[numberField, 1, true]]]]);
    cg = cg.set([[textField, "c", false, [[numberField, 1, false]]]]);
    cg = cg.set([[textField, "c", false, [[numberField, 2, true]]]]);

    test("a", () => {
      const collapsedGroup = cg.get(textField, "a");
      expect(collapsedGroup.collapsed).toBeTruthy();
      if (collapsedGroup.children === undefined) {
        fail("Expected collapsed group to have children");
      }
      const collapsedGroupChild = collapsedGroup.children.get(numberField, 2);
      expect(collapsedGroupChild.collapsed).toBeTruthy();
    });

    test("b", () => {
      const collapsedGroup = cg.get(textField, "b");
      expect(collapsedGroup.collapsed).toBeFalsy();
      if (collapsedGroup.children === undefined) {
        fail("Expected collapsed group to have children");
      }
      const collapsedGroupChild = collapsedGroup.children.get(numberField, 1);
      expect(collapsedGroupChild.collapsed).toBeTruthy();
    });

    test("c", () => {
      const collapsedGroup = cg.get(textField, "c");
      expect(collapsedGroup.collapsed).toBeFalsy();
      if (collapsedGroup.children === undefined) {
        fail("Expected collapsed group to have children");
      }
      const collapsedGroupChild1 = collapsedGroup.children.get(numberField, 1);
      expect(collapsedGroupChild1.collapsed).toBeFalsy();
      if (collapsedGroup.children === undefined) {
        fail("Expected collapsed group to have children");
      }
      const collapsedGroupChild2 = collapsedGroup.children.get(numberField, 2);
      expect(collapsedGroupChild2.collapsed).toBeTruthy();
    });
  });
});

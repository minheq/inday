import {
  addFieldsToCollection,
  makeCollaborator,
  makeCollection,
  makeDocument,
  makeField,
  makeGroup,
} from "../../../models/factory";
import { FieldType } from "../../../models/fields";
import { SortGetters } from "../../../models/sorts";
import { getListViewDocumentNodes } from "./list_view_nodes";

describe("getListViewDocumentNodes", () => {
  const collection = makeCollection({});
  const numberField = makeField({
    type: FieldType.Number,
    collectionID: collection.id,
  });
  const textField = makeField({
    type: FieldType.SingleLineText,
    collectionID: collection.id,
  });
  const collectionWithFields = addFieldsToCollection(collection, [
    numberField,
    textField,
  ]);

  const document1 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: "AWord" } },
    collectionWithFields
  );
  const document2 = makeDocument(
    { fields: { [numberField.id]: 2, [textField.id]: "BWord" } },
    collectionWithFields
  );
  const document3 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: "BWord" } },
    collectionWithFields
  );
  const document4 = makeDocument(
    { fields: { [numberField.id]: 1, [textField.id]: "AWord" } },
    collectionWithFields
  );
  const fields = [numberField, textField];
  const documents = [document1, document2, document3, document4];
  const collaborator = makeCollaborator({});

  const getters: SortGetters = {
    getField: (fieldID) => {
      const field = fields.find((d) => d.id === fieldID);

      if (field === undefined) {
        throw new Error("Document not found");
      }

      return field;
    },
    getDocument: (documentID) => {
      const document = documents.find((d) => d.id === documentID);

      if (document === undefined) {
        throw new Error("Document not found");
      }

      return document;
    },
    getCollection: () => collection,
    getCollaborator: () => collaborator,
  };

  test("flat", () => {
    const result = getListViewDocumentNodes(
      [document1, document2, document3, document4],
      [],
      getters
    );

    expect(result[0].children[0]).toEqual(document1);
    expect(result[0].children[1]).toEqual(document2);
    expect(result[0].children[2]).toEqual(document3);
    expect(result[0].children[3]).toEqual(document4);
  });

  test("grouped 1 level", () => {
    const group = makeGroup(
      {},
      { fieldID: numberField.id, order: "ascending" }
    );

    const result = getListViewDocumentNodes(
      [document1, document2, document3, document4],
      [group],
      getters
    );

    expect(result[0]).toMatchObject({
      type: "leaf",
      value: 1,
      children: [document3, document4],
    });
    expect(result[1]).toMatchObject({
      type: "leaf",
      value: 2,
      children: [document1, document2],
    });
  });

  test("grouped 1 level", () => {
    const group = makeGroup(
      {},
      { fieldID: numberField.id, order: "ascending" }
    );

    const result = getListViewDocumentNodes(
      [document1, document2, document3, document4],
      [group],
      getters
    );

    expect(result[0]).toMatchObject({
      type: "leaf",
      value: 1,
      children: [document3, document4],
    });
    expect(result[1]).toMatchObject({
      type: "leaf",
      value: 2,
      children: [document1, document2],
    });
  });

  test("grouped 2 level", () => {
    const group1 = makeGroup(
      {},
      { fieldID: numberField.id, order: "ascending" }
    );
    const group2 = makeGroup({}, { fieldID: textField.id, order: "ascending" });

    // const collapsedGroups = {
    //   [numberField.id]: {
    //     values: [1],
    //     fields: {
    //       [textField.id]: ["AWord"],
    //     },
    //   },
    // };

    const result = getListViewDocumentNodes(
      [document1, document2, document3, document4],
      [group1, group2],
      getters
    );

    expect(result[0]).toMatchObject({
      type: "ancestor",
      value: 1,
      children: [
        {
          type: "leaf",
          value: "AWord",
          children: [document4],
        },
        {
          type: "leaf",
          value: "BWord",
          children: [document3],
        },
      ],
    });

    expect(result[1]).toMatchObject({
      type: "ancestor",
      value: 2,
      children: [
        {
          type: "leaf",
          value: "AWord",
          children: [document1],
        },
        {
          type: "leaf",
          value: "BWord",
          children: [document2],
        },
      ],
    });
  });
});

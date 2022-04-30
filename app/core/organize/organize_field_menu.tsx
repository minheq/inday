import React, { Fragment, createContext, useCallback, useContext } from "react";
import { ScrollView, View } from "react-native";
import { Row } from "../../components/row";
import { Spacer } from "../../components/spacer";
import { Switch } from "../../components/switch";
import { Text } from "../../components/text";
import { tokens } from "../../components/tokens";
import { CollectionID } from "../../../models/collections";

import { useSortedFieldsWithListViewConfigQuery } from "../../store/queries";
import { FieldWithListViewConfig, ViewID } from "../../../models/views";
import { useUpdateListViewFieldConfigMutation } from "../../store/mutations";

interface FieldMenuContext {
  viewID: ViewID;
  collectionID: CollectionID;
}

const FieldMenuContext = createContext<FieldMenuContext>({
  viewID: "viw",
  collectionID: "col",
});

interface FieldMenuProps {
  viewID: ViewID;
  collectionID: CollectionID;
}

export function FieldMenu(props: FieldMenuProps): JSX.Element {
  const { viewID, collectionID } = props;

  const fields = useSortedFieldsWithListViewConfigQuery(viewID);

  return (
    <FieldMenuContext.Provider value={{ viewID, collectionID }}>
      <View flex={1}>
        <ScrollView>
          <View paddingHorizontal={16}>
            {fields.map((field) => (
              <Fragment key={field.id}>
                <FieldListItem field={field} />
                <Spacer size={8} />
              </Fragment>
            ))}
          </View>
        </ScrollView>
      </View>
    </FieldMenuContext.Provider>
  );
}

interface FieldListItemProps {
  field: FieldWithListViewConfig;
}

function FieldListItem(props: FieldListItemProps) {
  const { field } = props;
  const { viewID } = useContext(FieldMenuContext);
  const updateListViewFieldConfig = useUpdateListViewFieldConfigMutation();

  const handleChange = useCallback(
    (value: boolean) => {
      updateListViewFieldConfig(viewID, field.id, {
        ...field.config,
        visible: value,
      });
    },
    [updateListViewFieldConfig, viewID, field]
  );

  return (
    <View padding={16} borderRadius={tokens.border.radius} shadow>
      <Row justifyContent="space-between">
        <Text>{field.name}</Text>
        <Switch value={field.config.visible} onChange={handleChange} />
      </Row>
    </View>
  );
}

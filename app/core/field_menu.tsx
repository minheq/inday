import React, { Fragment, createContext, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';

import { Container, Spacer, Text, Row, tokens, Switch } from '../components';
import {
  useGetSortedFieldsWithListViewConfig,
  useUpdateListViewFieldConfig,
} from '../data/store';
import { FieldWithListViewConfig } from '../data/views';

const FieldMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface FieldMenuProps {
  viewID: string;
  collectionID: string;
}

export function FieldMenu(props: FieldMenuProps): JSX.Element {
  const { viewID, collectionID } = props;

  const fields = useGetSortedFieldsWithListViewConfig(viewID);

  return (
    <FieldMenuContext.Provider value={{ viewID, collectionID }}>
      <Container flex={1}>
        <ScrollView>
          <Container paddingHorizontal={16}>
            {fields.map((field) => (
              <Fragment key={field.id}>
                <FieldListItem field={field} />
                <Spacer size={8} />
              </Fragment>
            ))}
          </Container>
        </ScrollView>
      </Container>
    </FieldMenuContext.Provider>
  );
}

interface FieldListItemProps {
  field: FieldWithListViewConfig;
}

function FieldListItem(props: FieldListItemProps) {
  const { field } = props;
  const context = useContext(FieldMenuContext);
  const updateListViewFieldConfig = useUpdateListViewFieldConfig();

  const handleChange = useCallback(
    (value: boolean) => {
      updateListViewFieldConfig(context.viewID, field.id, {
        ...field.config,
        visible: value,
      });
    },
    [updateListViewFieldConfig, context, field],
  );

  return (
    <Container padding={16} borderRadius={tokens.border.radius.default} shadow>
      <Row justifyContent="space-between">
        <Text>{field.name}</Text>
        <Switch value={field.config.visible} onChange={handleChange} />
      </Row>
    </Container>
  );
}

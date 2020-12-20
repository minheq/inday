import React, { Fragment, createContext, useCallback, useContext } from 'react';
import { ScrollView } from 'react-native';
import { Container } from '../components/container';
import { Row } from '../components/row';
import { Spacer } from '../components/spacer';
import { Switch } from '../components/switch';
import { Text } from '../components/text';
import { tokens } from '../components/tokens';
import { CollectionID } from '../data/collections';

import {
  useGetSortedFieldsWithListViewConfig,
  useUpdateListViewFieldConfig,
} from '../data/store';
import { FieldWithListViewConfig, ViewID } from '../data/views';

interface FieldMenuContext {
  viewID: ViewID;
  collectionID: CollectionID;
}

const FieldMenuContext = createContext<FieldMenuContext>({
  viewID: 'viw',
  collectionID: 'col',
});

interface FieldMenuProps {
  viewID: ViewID;
  collectionID: CollectionID;
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
  const { viewID } = useContext(FieldMenuContext);
  const updateListViewFieldConfig = useUpdateListViewFieldConfig();

  const handleChange = useCallback(
    (value: boolean) => {
      updateListViewFieldConfig(viewID, field.id, {
        ...field.config,
        visible: value,
      });
    },
    [updateListViewFieldConfig, viewID, field],
  );

  return (
    <Container padding={16} borderRadius={tokens.border.radius} shadow>
      <Row justifyContent="space-between">
        <Text>{field.name}</Text>
        <Switch value={field.config.visible} onChange={handleChange} />
      </Row>
    </Container>
  );
}

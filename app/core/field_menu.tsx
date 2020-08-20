import React, { Fragment, createContext } from 'react';
import { ScrollView } from 'react-native';

import { Container, Spacer, Text, Row, tokens, Switch } from '../components';
import { useGetListViewFieldsWithConfig } from '../data/store';
import { FieldWithListViewConfig } from '../data/views';

const FieldMenuContext = createContext({
  viewID: '',
  collectionID: '',
});

interface FieldMenuProps {
  viewID: string;
  collectionID: string;
}

export function FieldMenu(props: FieldMenuProps) {
  const { viewID, collectionID } = props;

  const fields = useGetListViewFieldsWithConfig(viewID);

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

  return (
    <Container padding={16} borderRadius={tokens.radius} shadow>
      <Row>
        <Text>{field.name}</Text>
        <Switch value={field.config.visible} />
      </Row>
    </Container>
  );
}

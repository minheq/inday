import React, { useRef, useEffect } from 'react';
import { ScrollView, Animated } from 'react-native';
import { Container, Text, Row, Column, Spacer, Icon } from '../components';
import {
  useGetViewDocuments,
  useGetFieldsWithListViewConfig,
} from '../data/store';
import { Field, FieldType } from '../data/fields';
import {
  FieldValue,
  assertCheckboxFieldValue,
  assertCurrencyFieldValue,
  assertDateFieldValue,
  assertEmailFieldValue,
  assertMultiCollaboratorFieldValue,
  assertMultiDocumentLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleDocumentLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  Document,
} from '../data/documents';
import {
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiDocumentLinkField,
  assertMultiLineTextField,
  assertMultiOptionField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleDocumentLinkField,
  assertSingleLineTextField,
  assertSingleOptionField,
  assertURLField,
} from '../data/fields';
import { format } from 'date-fns';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { ListView, ListViewFieldConfig } from '../data/views';

interface ListViewDisplayProps {
  view: ListView;
}

const LEFT_COLUMN_WIDTH = 40;
const DOCUMENT_HEIGHT = 32;
const FIELD_HEIGHT = 40;

export function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const fields = useGetFieldsWithListViewConfig(view.id);
  const documents = useGetViewDocuments(view.id);
  const scrollPosition = useRef(new Animated.Value(0)).current;

  const { fieldsConfig } = view;

  const headerScrollView = React.useRef<ScrollView>(null);

  useEffect(() => {
    const listenerID = scrollPosition.addListener((position) => {
      headerScrollView.current!.scrollTo({
        x: position.value,
        animated: false,
      });
    });

    () => {
      scrollPosition.removeListener(listenerID);
    };
  }, [scrollPosition]);

  return (
    <Container flex={1}>
      <Container height={FIELD_HEIGHT}>
        <Row>
          <Container
            color="tint"
            width={LEFT_COLUMN_WIDTH}
            height={FIELD_HEIGHT}
            borderBottomWidth={1}
            borderRightWidth={1}
          />
          <ScrollView horizontal ref={headerScrollView} scrollEnabled={false}>
            {fields.map((field) => {
              return (
                <Container
                  color="tint"
                  key={field.id}
                  height={FIELD_HEIGHT}
                  width={field.config.width}
                  borderBottomWidth={1}
                  borderRightWidth={1}
                  padding={8}
                >
                  <Row alignItems="center">
                    <Icon name="menu" />
                    <Spacer size={8} />
                    <Text>{field.name}</Text>
                  </Row>
                </Container>
              );
            })}
          </ScrollView>
        </Row>
      </Container>
      <AutoSizer>
        {({ height }) => (
          <Container height={height}>
            <ScrollView>
              <Row flex={1}>
                <Container width={LEFT_COLUMN_WIDTH}>
                  <Column>
                    {documents.map((doc, i) => (
                      <Container
                        key={doc.id}
                        borderBottomWidth={1}
                        borderRightWidth={1}
                        height={DOCUMENT_HEIGHT}
                        center
                      >
                        <Text>{i + 1}</Text>
                      </Container>
                    ))}
                  </Column>
                </Container>

                <Animated.ScrollView
                  horizontal
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { x: scrollPosition } } }],
                    { useNativeDriver: false },
                  )}
                  scrollEventThrottle={16}
                >
                  <Column>
                    {documents.map((doc) => (
                      <Container
                        key={doc.id}
                        color="content"
                        borderBottomWidth={1}
                        height={DOCUMENT_HEIGHT}
                      >
                        <Row key={doc.id}>
                          {fields.map((field) => {
                            const fieldConfig = fieldsConfig[field.id];

                            return (
                              <Cell
                                document={doc}
                                field={field}
                                fieldConfig={fieldConfig}
                              />
                            );
                          })}
                        </Row>
                      </Container>
                    ))}
                  </Column>
                </Animated.ScrollView>
              </Row>
            </ScrollView>
          </Container>
        )}
      </AutoSizer>
    </Container>
  );
}

interface CellProps {
  field: Field;
  fieldConfig: ListViewFieldConfig;
  document: Document;
}

function Cell(props: CellProps) {
  const { document, field, fieldConfig } = props;

  const cell = documentFieldValueComponentByFieldType[field.type](
    document.fields[field.id],
    field,
  );

  return (
    <Container
      key={`${field.id}${document.id}`}
      width={fieldConfig.width}
      height="100%"
      borderRightWidth={1}
      padding={4}
      paddingHorizontal={8}
    >
      {cell}
    </Container>
  );
}

const documentFieldValueComponentByFieldType: {
  [fieldType in FieldType]: (
    value: FieldValue,
    field: Field,
  ) => React.ReactNode;
} = {
  [FieldType.Checkbox]: (value, field) => {
    assertCheckboxFieldValue(value);
    assertCheckboxField(field);

    return <Text>{value ? 'checked' : 'unchecked'}</Text>;
  },
  [FieldType.Currency]: (value, field) => {
    assertCurrencyFieldValue(value);
    assertCurrencyField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.Date]: (value, field) => {
    assertDateFieldValue(value);
    assertDateField(field);

    if (value === null) {
      return null;
    }

    return <Text>{format(value, field.format)}</Text>;
  },
  [FieldType.Email]: (value, field) => {
    assertEmailFieldValue(value);
    assertEmailField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.MultiCollaborator]: (value, field) => {
    assertMultiCollaboratorFieldValue(value);
    assertMultiCollaboratorField(field);

    return <Text>{value[0]}</Text>;
  },

  [FieldType.MultiDocumentLink]: (value, field) => {
    assertMultiDocumentLinkFieldValue(value);
    assertMultiDocumentLinkField(field);

    return <Text>{value[0]}</Text>;
  },
  [FieldType.MultiLineText]: (value, field) => {
    assertMultiLineTextFieldValue(value);
    assertMultiLineTextField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.MultiOption]: (value, field) => {
    assertMultiOptionFieldValue(value);
    assertMultiOptionField(field);

    return <Text>{value[0]}</Text>;
  },

  [FieldType.Number]: (value, field) => {
    assertNumberFieldValue(value);
    assertNumberField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.PhoneNumber]: (value, field) => {
    assertPhoneNumberFieldValue(value);
    assertPhoneNumberField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleCollaborator]: (value, field) => {
    assertSingleCollaboratorFieldValue(value);
    assertSingleCollaboratorField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleDocumentLink]: (value, field) => {
    assertSingleDocumentLinkFieldValue(value);
    assertSingleDocumentLinkField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleLineText]: (value, field) => {
    assertSingleLineTextFieldValue(value);
    assertSingleLineTextField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.SingleOption]: (value, field) => {
    assertSingleOptionFieldValue(value);
    assertSingleOptionField(field);

    return <Text>{value}</Text>;
  },
  [FieldType.URL]: (value, field) => {
    assertURLFieldValue(value);
    assertURLField(field);

    return <Text>{value}</Text>;
  },
};

import React, { useRef, useEffect, useState } from 'react';
import { ScrollView, Animated } from 'react-native';
import { Container, Text, Row, Column, Spacer, Icon } from '../components';
import {
  useGetViewRecords,
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
  assertMultiRecordLinkFieldValue,
  assertMultiLineTextFieldValue,
  assertMultiOptionFieldValue,
  assertNumberFieldValue,
  assertPhoneNumberFieldValue,
  assertSingleCollaboratorFieldValue,
  assertSingleRecordLinkFieldValue,
  assertSingleLineTextFieldValue,
  assertSingleOptionFieldValue,
  assertURLFieldValue,
  Record,
} from '../data/records';
import {
  assertCheckboxField,
  assertCurrencyField,
  assertDateField,
  assertEmailField,
  assertMultiCollaboratorField,
  assertMultiRecordLinkField,
  assertMultiLineTextField,
  assertMultiOptionField,
  assertNumberField,
  assertPhoneNumberField,
  assertSingleCollaboratorField,
  assertSingleRecordLinkField,
  assertSingleLineTextField,
  assertSingleOptionField,
  assertURLField,
} from '../data/fields';
import { format } from 'date-fns';
import { AutoSizer } from '../lib/autosizer/autosizer';
import { ListView, FieldWithListViewConfig } from '../data/views';

interface ListViewDisplayProps {
  view: ListView;
}

const LEFT_COLUMN_WIDTH = 40;
const ROW_HEIGHT = 32;
const FIELD_HEIGHT = 40;

export function ListViewDisplay(props: ListViewDisplayProps) {
  const { view } = props;
  const fields = useGetFieldsWithListViewConfig(view.id);
  const records = useGetViewRecords(view.id);
  const scrollX = useRef(new Animated.Value(0)).current;

  const { frozenFieldsCount } = view;

  const headerScrollView = React.useRef<ScrollView>(null);

  useEffect(() => {
    const listenerID = scrollX.addListener((position) => {
      headerScrollView.current!.scrollTo({
        x: position.value,
        animated: false,
      });
    });

    return () => {
      scrollX.removeListener(listenerID);
    };
  }, [scrollX]);

  const frozenFieldsWidth = fields
    .slice(0, frozenFieldsCount)
    .reduce((prevValue, field) => prevValue + field.config.width, 0);

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
          <Container width={frozenFieldsWidth}>
            <ScrollView horizontal ref={headerScrollView} scrollEnabled={false}>
              {fields.slice(0, frozenFieldsCount).map((field) => {
                return <HeaderCell field={field} />;
              })}
            </ScrollView>
          </Container>
          <ScrollView horizontal ref={headerScrollView} scrollEnabled={false}>
            {fields.slice(frozenFieldsCount).map((field) => {
              return <HeaderCell field={field} />;
            })}
          </ScrollView>
        </Row>
      </Container>
      <AutoSizer>
        {({ height }) => (
          <Rows
            height={height}
            records={records}
            fields={fields}
            scrollX={scrollX}
            frozenFieldsCount={frozenFieldsCount}
            frozenFieldsWidth={frozenFieldsWidth}
          />
        )}
      </AutoSizer>
    </Container>
  );
}

interface RowsProps {
  height: number;
  records: Record[];
  fields: FieldWithListViewConfig[];
  frozenFieldsCount: number;
  frozenFieldsWidth: number;
  scrollX: Animated.Value;
}

function Rows(props: RowsProps) {
  const {
    height,
    records,
    fields,
    frozenFieldsCount,
    frozenFieldsWidth,
    scrollX,
  } = props;
  const scrollY = useRef(new Animated.Value(0)).current;
  const [scrollTop, setScrollTop] = useState(0);
  const innerHeight = records.length * ROW_HEIGHT;

  useEffect(() => {
    const listenerID = scrollY.addListener((position) => {
      setScrollTop(position.value);
    });

    return () => {
      scrollY.removeListener(listenerID);
    };
  }, [scrollY]);

  const startIndex = Math.floor(scrollTop / ROW_HEIGHT);
  const endIndex = Math.min(
    records.length - 1, // don't render past the end of the list
    Math.floor((scrollTop + height) / ROW_HEIGHT),
  );

  const rows = [];

  for (let index = startIndex; index <= endIndex; index++) {
    const record = records[index];

    rows.push({ index, record });
  }

  return (
    <Container height={height}>
      <ScrollView
        onScroll={Animated.event(
          [
            {
              nativeEvent: {
                contentOffset: {
                  y: scrollY,
                },
              },
            },
          ],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <Row flex={1}>
          <Container width={LEFT_COLUMN_WIDTH}>
            <Column>
              {rows.map((row) => {
                const { record, index } = row;

                return (
                  <Container
                    position="absolute"
                    top={index * ROW_HEIGHT}
                    width="100%"
                  >
                    <LeftColumnCell
                      key={record.id}
                      index={index}
                      record={record}
                    />
                  </Container>
                );
              })}
            </Column>
          </Container>
          <Container width={frozenFieldsWidth}>
            <ScrollView
              horizontal
              contentContainerStyle={{ height: innerHeight }}
            >
              <Column>
                {rows.map((row) => {
                  const { record, index } = row;

                  return (
                    <Container
                      position="absolute"
                      top={index * ROW_HEIGHT}
                      key={record.id}
                      color="content"
                      borderBottomWidth={1}
                      height={ROW_HEIGHT}
                    >
                      <Row key={record.id}>
                        {fields.slice(0, frozenFieldsCount).map((field) => {
                          return (
                            <BodyCell
                              key={`${field.id}${record.id}`}
                              record={record}
                              field={field}
                            />
                          );
                        })}
                      </Row>
                    </Container>
                  );
                })}
              </Column>
            </ScrollView>
          </Container>
          <ScrollView
            contentContainerStyle={{ height: innerHeight }}
            horizontal
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: scrollX,
                    },
                  },
                },
              ],
              { useNativeDriver: false },
            )}
            scrollEventThrottle={16}
          >
            <Column>
              {rows.map((row) => {
                const { record, index } = row;
                return (
                  <Container
                    position="absolute"
                    top={index * ROW_HEIGHT}
                    key={record.id}
                    color="content"
                    borderBottomWidth={1}
                    height={ROW_HEIGHT}
                  >
                    <Row key={record.id}>
                      {fields.slice(frozenFieldsCount).map((field) => {
                        return (
                          <BodyCell
                            key={`${field.id}${record.id}`}
                            record={record}
                            field={field}
                          />
                        );
                      })}
                    </Row>
                  </Container>
                );
              })}
            </Column>
          </ScrollView>
        </Row>
      </ScrollView>
    </Container>
  );
}

interface BodyCellProps {
  field: FieldWithListViewConfig;
  record: Record;
}

function BodyCell(props: BodyCellProps) {
  const { record, field } = props;

  const cell = recordFieldValueComponentByFieldType[field.type](
    record.fields[field.id],
    field,
  );

  return (
    <Container
      width={field.config.width}
      height="100%"
      borderRightWidth={1}
      padding={4}
      paddingHorizontal={8}
    >
      {cell}
    </Container>
  );
}

interface HeaderCellProps {
  field: FieldWithListViewConfig;
}

function HeaderCell(props: HeaderCellProps) {
  const { field } = props;

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
}

interface LeftColumnCellProps {
  record: Record;
  index: number;
}

function LeftColumnCell(props: LeftColumnCellProps) {
  const { record, index } = props;

  return (
    <Container
      key={record.id}
      borderBottomWidth={1}
      borderRightWidth={1}
      height={ROW_HEIGHT}
      center
    >
      <Text>{index}</Text>
    </Container>
  );
}

const recordFieldValueComponentByFieldType: {
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

  [FieldType.MultiRecordLink]: (value, field) => {
    assertMultiRecordLinkFieldValue(value);
    assertMultiRecordLinkField(field);

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
  [FieldType.SingleRecordLink]: (value, field) => {
    assertSingleRecordLinkFieldValue(value);
    assertSingleRecordLinkField(field);

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

import React, { Fragment } from 'react';
import { isEmpty } from '../../lib/lang_utils';
import { Row } from '../components/row';

import { MultiOptionFieldValue, MultiOptionField } from '../data/fields';
import { OptionBadge } from './option_badge';

interface FieldMultiOptionValueViewProps {
  field: MultiOptionField;
  value: MultiOptionFieldValue;
}

export function FieldMultiOptionValueView(
  props: FieldMultiOptionValueViewProps,
): JSX.Element {
  const { value, field } = props;

  if (isEmpty(value)) {
    return <Fragment />;
  }

  return (
    <Row spacing={4}>
      {value.map((_value) => {
        const selected = field.options.find((o) => o.id === _value);

        if (selected === undefined) {
          throw new Error(
            `Expected ${_value} to be within field options ${JSON.stringify(
              field,
            )}`,
          );
        }

        return <OptionBadge key={selected.id} option={selected} />;
      })}
    </Row>
  );
}

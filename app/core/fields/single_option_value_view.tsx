import React, { Fragment } from 'react';
import { Row } from '../../components/row';

import { SingleOptionFieldValue, SingleOptionField } from '../../data/fields';
import { OptionBadge } from './option_badge';

interface FieldSingleOptionValueViewProps {
  field: SingleOptionField;
  value: SingleOptionFieldValue;
}

export function FieldSingleOptionValueView(
  props: FieldSingleOptionValueViewProps,
): JSX.Element {
  const { value, field } = props;

  const selected = field.options.find((o) => o.id === value);

  if (value === null || selected === undefined) {
    return <Fragment />;
  }

  return (
    <Row>
      <OptionBadge option={selected} />
    </Row>
  );
}

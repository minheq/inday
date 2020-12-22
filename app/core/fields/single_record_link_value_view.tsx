import React, { Fragment } from 'react';

import {
  SingleRecordLinkFieldValue,
  SingleRecordLinkField,
} from '../../data/fields';
import { RecordLinkBadge } from './record_link_badge';

interface FieldSingleRecordLinkValueViewProps {
  field: SingleRecordLinkField;
  value: SingleRecordLinkFieldValue;
}

export function FieldSingleRecordLinkValueView(
  props: FieldSingleRecordLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <Fragment />;
  }

  return <RecordLinkBadge recordID={value} />;
}

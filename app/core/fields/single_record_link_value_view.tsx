import React, { Fragment } from 'react';

import {
  SingleRecordLinkFieldValue,
  SingleRecordLinkField,
} from '../../data/fields';
import { RecordLinkBadge } from './record_link_badge';

interface SingleRecordLinkValueViewProps {
  field: SingleRecordLinkField;
  value: SingleRecordLinkFieldValue;
}

export function SingleRecordLinkValueView(
  props: SingleRecordLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (value === null) {
    return <Fragment />;
  }

  return <RecordLinkBadge recordID={value} />;
}

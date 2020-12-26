import React, { Fragment } from 'react';

import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';

import {
  MultiRecordLinkFieldValue,
  MultiRecordLinkField,
} from '../../data/fields';
import { RecordLinkBadge } from './record_link_badge';

interface MultiRecordLinkValueViewProps {
  field: MultiRecordLinkField;
  value: MultiRecordLinkFieldValue;
}

export function MultiRecordLinkValueView(
  props: MultiRecordLinkValueViewProps,
): JSX.Element {
  const { value } = props;

  if (isEmpty(value)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {value.map((recordID) => (
        <RecordLinkBadge recordID={recordID} key={recordID} />
      ))}
    </Row>
  );
}

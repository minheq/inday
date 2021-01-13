import React, { Fragment } from 'react';
import { isEmpty } from '../../../lib/lang_utils';
import { Row } from '../../components/row';

import { MultiSelectField, SelectOptionID } from '../../../models/fields';
import { OptionBadge } from './option_badge';

interface OptionBadgeListProps {
  field: MultiSelectField;
  optionIDs: SelectOptionID[];
}

export function OptionBadgeList(props: OptionBadgeListProps): JSX.Element {
  const { optionIDs, field } = props;

  if (isEmpty(optionIDs)) {
    return <Fragment />;
  }

  return (
    <Row spacing={8}>
      {optionIDs.map((optionID) => {
        const selected = field.options.find((o) => o.id === optionID);

        if (selected === undefined) {
          throw new Error(
            `Expected ${optionID} to be within field options ${JSON.stringify(
              field,
            )}`,
          );
        }

        return <OptionBadge key={selected.id} option={selected} />;
      })}
    </Row>
  );
}

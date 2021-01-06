import React, { useCallback } from 'react';

import { formatISODate, parseISODate } from '../../../lib/date_utils';
import { DateFieldValue } from '../../../models/fields';
import { DatePicker } from '../../components/date_picker';

interface DateValueEditProps {
  value: DateFieldValue;
  onChange: (value: DateFieldValue) => void;
}

export function DateValueEdit(props: DateValueEditProps): JSX.Element {
  const { value, onChange } = props;

  const handleChangeDate = useCallback(
    (date: Date) => {
      onChange(formatISODate(date));
    },
    [onChange],
  );

  return (
    <DatePicker
      value={value ? parseISODate(value) : null}
      onChange={handleChangeDate}
    />
  );
}

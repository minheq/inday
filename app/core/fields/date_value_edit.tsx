import React, { useCallback } from 'react';

import { formatISODate, parseISODate } from '../../../lib/date_utils';

import { DateFieldValue } from '../../../models/fields';
import { DatePicker } from '../../components/date_picker';

interface DateValueInputProps {
  value: DateFieldValue;
  onChange: (value: DateFieldValue) => void;
}

export function DateValueInput(props: DateValueInputProps): JSX.Element {
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

import React from 'react';

import { TimePicker } from '../app/components';

export default {
  title: 'TimePicker',
  component: TimePicker,
};

function StatefulCheckbox() {
  const [value, setValue] = React.useState<Date>();
  console.log(value);

  return (
    <TimePicker
      placeholder="Set time"
      value={value}
      onChange={(date) => {
        setValue(date);
      }}
    />
  );
}

export const Default = () => <StatefulCheckbox />;

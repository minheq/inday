import React from 'react';

import { TimePicker } from './time_picker';

export default {
  title: 'TimePicker',
  component: TimePicker,
};

function StatefulCheckbox() {
  const [value, setValue] = React.useState<Date>();

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

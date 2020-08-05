import React from 'react';

import { ListPicker } from './list_picker';

export default {
  title: 'ListPicker',
  component: ListPicker,
};

export const Default = () => {
  const [value, setValue] = React.useState(['January', 'Februrary']);

  return (
    <ListPicker
      multi
      value={value}
      options={[
        { label: 'January', value: 'January' },
        { label: 'February', value: 'February' },
        { label: 'March', value: 'March' },
        { label: 'April', value: 'April' },
        { label: 'May', value: 'May' },
        { label: 'June', value: 'June' },
        { label: 'July', value: 'July' },
        { label: 'August', value: 'August' },
        { label: 'September', value: 'September' },
        { label: 'October', value: 'October' },
        { label: 'November', value: 'November' },
        { label: 'December', value: 'December' },
      ]}
      onChange={setValue}
    />
  );
};

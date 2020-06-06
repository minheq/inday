import React from 'react';

import { Checkbox } from '../app/components';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

function StatefulCheckbox() {
  const [value, setValue] = React.useState(false);
  return <Checkbox value={value} onChange={setValue} />;
}

export const Default = () => <StatefulCheckbox />;

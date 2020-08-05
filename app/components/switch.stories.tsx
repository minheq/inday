import React from 'react';

import { Switch } from './switch';

export default {
  title: 'Switch',
  component: Switch,
};

function StatefulCheckbox() {
  const [value, setValue] = React.useState(false);
  return <Switch value={value} onChange={setValue} />;
}

export const Default = () => <StatefulCheckbox />;

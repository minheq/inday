import React from 'react';

import { Switch } from './switch';

export default {
  title: 'Switch',
  component: Switch,
};

export function Basic(): JSX.Element {
  const [value, setValue] = React.useState(false);

  return <Switch value={value} onChange={setValue} />;
}

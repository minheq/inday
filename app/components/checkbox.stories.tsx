import React from 'react';

import { Checkbox } from './checkbox';

export default {
  title: 'Checkbox',
  component: Checkbox,
};

export function Basic(): JSX.Element {
  const [value, setValue] = React.useState(false);

  return <Checkbox value={value} onChange={setValue} />;
}

import React from 'react';

import { Badge } from './badge';

export default {
  title: 'Badge',
  component: Badge,
};

export function Basic(): JSX.Element {
  return <Badge title="Badge" />;
}

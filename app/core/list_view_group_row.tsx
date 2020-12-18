import React from 'react';
import { View } from 'react-native';

import { GroupRowState } from '../components/grid_renderer.common';

interface GroupRowProps {
  state: GroupRowState;
  children: React.ReactNode;
}

export function GroupRow(props: GroupRowProps): JSX.Element {
  const { children } = props;

  return <View>{children}</View>;
}

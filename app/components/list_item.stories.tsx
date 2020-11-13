import React from 'react';

import { ListItem } from './list_item';
import { Column } from './column';

export default {
  title: 'ListItem',
  component: ListItem,
};

export function Basic(): JSX.Element {
  return (
    <Column>
      <ListItem title="Title" description="Description" />
      <ListItem title="Title" />
      <ListItem description="Description" />
    </Column>
  );
}

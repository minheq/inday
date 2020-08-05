import React from 'react';

import { ListItem } from './list_item';
import { Column } from './column';

export default {
  title: 'ListItem',
  component: ListItem,
};

export const Default = () => (
  <Column>
    <ListItem title="Title" description="Description" />
    <ListItem title="Title" />
    <ListItem description="Description" />
  </Column>
);

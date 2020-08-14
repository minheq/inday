import React, { useState } from 'react';

import { Container, SegmentedControl, Spacer } from '../components';
import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';
import { CollectionID } from '../data/collections';
import { FilterMenu } from './filter_menu';

interface OrganizeMenuProps {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

export function OrganizeMenu(props: OrganizeMenuProps) {
  const { viewID, collectionID } = props;

  const [tab, setTab] = useState(2);

  return (
    <Container flex={1}>
      <Container padding={16}>
        <SegmentedControl
          onChange={setTab}
          value={tab}
          options={[
            { label: 'Fields', value: 1 },
            { label: 'Filter', value: 2 },
            { label: 'Sort', value: 3 },
            { label: 'Group', value: 4 },
          ]}
        />
      </Container>
      <Spacer size={16} />
      {tab === 2 && <FilterMenu viewID={viewID} collectionID={collectionID} />}
    </Container>
  );
}

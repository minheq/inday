import React, { useState } from 'react';

import { SpaceID } from '../data/spaces';
import { ViewID } from '../data/views';
import { CollectionID } from '../data/collections';
import { FilterMenu } from './organize_filter_menu';
import { SortMenu } from './organize_sort_menu';
import { GroupMenu } from './organize_group_menu';
import { FieldMenu } from './organize_field_menu';
import { SegmentedControl } from '../components/segmented_control';
import { Spacer } from '../components/spacer';
import { View } from 'react-native';

interface OrganizeViewProps {
  spaceID: SpaceID;
  viewID: ViewID;
  collectionID: CollectionID;
}

export function OrganizeView(props: OrganizeViewProps): JSX.Element {
  const { viewID, collectionID } = props;

  const [tab, setTab] = useState(2);

  return (
    <View>
      <View>
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
      </View>
      <Spacer size={16} />
      {tab === 1 && <FieldMenu viewID={viewID} collectionID={collectionID} />}
      {tab === 2 && <FilterMenu viewID={viewID} collectionID={collectionID} />}
      {tab === 3 && <SortMenu viewID={viewID} collectionID={collectionID} />}
      {tab === 4 && <GroupMenu viewID={viewID} collectionID={collectionID} />}
    </View>
  );
}

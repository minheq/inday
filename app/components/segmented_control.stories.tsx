import React, { useState } from 'react';
import { View } from 'react-native';

import { SegmentedControl } from './segmented_control';

function Basic(): JSX.Element {
  const [value, setValue] = useState(1);

  return (
    <View>
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { value: 1, label: 'Option A' },
          { value: 2, label: 'Option B' },
          { value: 3, label: 'Option C' },
        ]}
      />
    </View>
  );
}

export function SegmentedControlStories(): JSX.Element {
  return (
    <View>
      <Basic />
    </View>
  );
}

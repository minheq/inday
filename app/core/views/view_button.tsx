import React, { useCallback } from 'react';
import { StyleSheet } from 'react-native';

import { Spacer } from '../../components/spacer';
import { Text } from '../../components/text';
import { ViewID, ViewType } from '../../data/views';
import { useTheme } from '../../components/theme';
import { PressableHighlight } from '../../components/pressable_highlight';
import { Icon } from '../../components/icon';
import { getViewIcon, getViewIconColor } from './icon_helpers';
import { tokens } from '../../components/tokens';

export interface ViewButtonProps {
  viewID: ViewID;
  name: string;
  type: ViewType;
  onPress: (viewID: ViewID) => void;
}

export function ViewButton(props: ViewButtonProps): JSX.Element {
  const { viewID, name, type, onPress } = props;
  const theme = useTheme();

  const handlePress = useCallback(() => {
    onPress(viewID);
  }, [onPress, viewID]);

  return (
    <PressableHighlight onPress={handlePress} style={styles.button}>
      <Icon
        name={getViewIcon(type)}
        customColor={getViewIconColor(type, theme.colorScheme)}
      />
      <Spacer direction="row" size={4} />
      <Text>{name}</Text>
    </PressableHighlight>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: tokens.border.radius,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 8,
    height: 40,
  },
});

import React from 'react';
import { StyleSheet, Pressable } from 'react-native';
import { Container } from './container';
import { Row } from './row';
import { Spacer } from './spacer';
import { Column } from './column';
import { Text } from './text';
import { tokens } from './tokens';

interface ListItemProps {
  onPress?: () => void;
  title?: string;
  description?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ListItem(props: ListItemProps): JSX.Element {
  const { onPress, title, description, leading, actions } = props;

  return (
    <Pressable style={styles.base} onPress={onPress}>
      <Container paddingVertical={8} paddingHorizontal={16}>
        <Row expanded justifyContent="space-between">
          <Container flex={1}>
            <Row expanded>
              {leading && (
                <>
                  {leading}
                  <Spacer size={8} />
                </>
              )}
              <Column justifyContent="center">
                {title && <Text weight="bold">{title}</Text>}
                {description && <Text>{description}</Text>}
              </Column>
            </Row>
          </Container>
          {actions && (
            <Row alignItems="center">
              <Spacer size={8} />
              {actions}
            </Row>
          )}
        </Row>
      </Container>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: tokens.radius,
  },
});

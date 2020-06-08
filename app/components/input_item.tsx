import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from './text';
import { Button } from './button';
import { Container } from './container';
import { Row } from './row';
import { Icon, IconName } from './icon';
import { Column } from './column';

interface InputItemProps {
  onPress?: () => void;
  label?: string;
  description?: string;
  placeholder?: string;
  icon: IconName;
}

export function InputItem(props: InputItemProps) {
  const { description, placeholder, label, icon, onPress } = props;

  return (
    <Row>
      <Button onPress={onPress} style={styles.button}>
        <Container
          paddingVertical={8}
          paddingLeft={16}
          paddingRight={40}
          shape="rounded"
          height={56}
        >
          <Column expanded justifyContent="center">
            <Text bold size="xs">
              {label}
            </Text>
            <Text color={description ? 'default' : 'muted'}>
              {description || placeholder}
            </Text>
          </Column>
        </Container>
        <View style={styles.arrowRight}>
          <Icon name={icon} size="lg" />
        </View>
      </Button>
    </Row>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
  },
  arrowRight: {
    position: 'absolute',
    right: 16,
    top: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

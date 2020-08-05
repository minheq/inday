import React from 'react';
import { IconName, Icon } from './icon';
import { Button } from './button';
import { Container } from './container';
import { Row } from './row';
import { Spacer } from './spacer';
import { Text } from './text';

interface FlatButtonProps {
  onPress?: () => void;
  title: string | IconName;
  iconBefore?: IconName;
  alignTitle?: 'left' | 'center' | 'right';
}

export function FlatButton(props: FlatButtonProps) {
  const { onPress, title, alignTitle = 'left', iconBefore } = props;

  return (
    <Button onPress={onPress}>
      <Container center height={40} paddingHorizontal={16}>
        <Row expanded alignItems="center">
          {iconBefore && (
            <>
              <Icon name={iconBefore} size="lg" />
              <Spacer size={8} />
            </>
          )}
          <Text>{title}</Text>
        </Row>
      </Container>
    </Button>
  );
}

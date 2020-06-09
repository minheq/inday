import React from 'react';
import { Container } from './container';
import { Row } from './row';
import { Spacing } from './spacing';
import { Column } from './column';
import { Text } from './text';
import { Button } from './button';

interface ListItemProps {
  onPress?: () => void;
  title?: string;
  description?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
}

export function ListItem(props: ListItemProps) {
  const { onPress, title, description, leading, actions } = props;

  return (
    <Button onPress={onPress}>
      <Container height={40} paddingHorizontal={16}>
        <Row expanded justifyContent="space-between">
          <Container flex={1}>
            <Row expanded>
              {leading && (
                <>
                  {leading}
                  <Spacing width={8} />
                </>
              )}
              <Column justifyContent="center">
                {title && <Text bold>{title}</Text>}
                {description && <Text>{description}</Text>}
              </Column>
            </Row>
          </Container>
          {actions && (
            <Row alignItems="center">
              <Spacing width={8} />
              {actions}
            </Row>
          )}
        </Row>
      </Container>
    </Button>
  );
}

import React from 'react';
import { Row, useNavigation, Container, BackButton } from '../components';

interface AppBarProps {
  leading?: React.ReactNode;
}

export function AppBar(_props: AppBarProps) {
  const { canGoBack, back } = useNavigation();

  return (
    <Container height={40} paddingHorizontal={16}>
      <Row expanded alignItems="center">
        <Container>{canGoBack && <BackButton onPress={back} />}</Container>
      </Row>
    </Container>
  );
}

import React from 'react';
import {
  Row,
  useNavigation,
  Container,
  BackButton,
  Divider,
} from '../components';

interface AppBarProps {
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  onBack?: () => void;
}

export function AppBar(props: AppBarProps) {
  const { onBack = () => {}, actions } = props;
  const { canGoBack, back } = useNavigation();

  const handlePressBack = React.useCallback(() => {
    back();
    onBack();
  }, [back, onBack]);

  return (
    <>
      <Container height={40} zIndex={2}>
        <Row expanded alignItems="center" justifyContent="space-between">
          <Container>
            {canGoBack && <BackButton onPress={handlePressBack} />}
          </Container>
          <Container>{actions}</Container>
        </Row>
      </Container>
      <Divider />
    </>
  );
}

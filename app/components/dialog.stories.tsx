import React, { useState } from 'react';
import { View } from 'react-native';

import { Dialog } from './dialog';
import { Container } from './container';
import { FlatButton } from './flat_button';

interface DialogBaseProps {
  animationType: 'fade' | 'slide' | 'none';
}

function DialogBase(props: DialogBaseProps) {
  const { animationType } = props;
  const [visible, setVisible] = useState(false);

  return (
    <View>
      <Dialog
        animationType={animationType}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <Container padding={40}>
          <Container height={300} width={400} color="primary" />
        </Container>
      </Dialog>
      <FlatButton onPress={() => setVisible(true)} title="Open dialog" />
    </View>
  );
}

function NoAnimation(): JSX.Element {
  return <DialogBase animationType="none" />;
}

function Slide(): JSX.Element {
  return <DialogBase animationType="slide" />;
}

function Fade(): JSX.Element {
  return <DialogBase animationType="fade" />;
}

export function DialogStories(): JSX.Element {
  return (
    <Container>
      <NoAnimation />
      <Slide />
      <Fade />
    </Container>
  );
}

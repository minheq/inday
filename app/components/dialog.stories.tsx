import React, { useState } from 'react';

import { Dialog } from './dialog';
import { Container } from './container';
import { View } from 'react-native';
import { FlatButton } from './flat_button';

export default {
  title: 'Dialog',
  component: Dialog,
};

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

export function NoAnimation(): JSX.Element {
  return <DialogBase animationType="none" />;
}

export function Slide(): JSX.Element {
  return <DialogBase animationType="slide" />;
}

export function Fade(): JSX.Element {
  return <DialogBase animationType="fade" />;
}

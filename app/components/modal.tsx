import React from "react";
import { Modal as RNModal } from "react-native";

export interface ModalProps {
  visible: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
  transparent?: boolean;
  animationType?: "none" | "slide" | "fade";
  onShow?: () => void;
  onDismiss?: () => void;
}

export function Modal(props: ModalProps): JSX.Element {
  const {
    children,
    visible,
    onRequestClose,
    onShow,
    onDismiss,
    animationType,
    transparent = false,
  } = props;

  return (
    <RNModal
      animationType={animationType}
      visible={visible}
      transparent={transparent}
      onRequestClose={onRequestClose}
      onShow={onShow}
      onDismiss={onDismiss}
    >
      {children}
    </RNModal>
  );
}

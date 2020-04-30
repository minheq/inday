import React from 'react';
import { Modal as RNModal } from 'react-native';

export interface ModalProps {
  isOpen: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
  transparent?: boolean;
  onShow?: () => void;
}

export function Modal(props: ModalProps) {
  const {
    children,
    isOpen,
    onRequestClose,
    onShow,
    transparent = false,
  } = props;

  return (
    <RNModal
      animationType="slide"
      visible={isOpen}
      transparent={transparent}
      onRequestClose={onRequestClose}
      onShow={onShow}
    >
      {children}
    </RNModal>
  );
}

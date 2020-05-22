import React from 'react';
import { Modal as RNModal } from 'react-native';

export interface ModalProps {
  isOpen: boolean;
  onRequestClose?: () => void;
  children?: React.ReactNode;
  transparent?: boolean;
  animationType?: 'none' | 'slide' | 'fade';
  onShow?: () => void;
}

export function Modal(props: ModalProps) {
  const {
    children,
    isOpen,
    onRequestClose,
    onShow,
    animationType,
    transparent = false,
  } = props;

  return (
    <RNModal
      animationType={animationType}
      visible={isOpen}
      transparent={transparent}
      onRequestClose={onRequestClose}
      onShow={onShow}
    >
      {children}
    </RNModal>
  );
}

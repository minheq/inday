import React from 'react';
import { TouchableOpacity } from 'react-native';
// import RNImagePicker from 'react-native-image-crop-picker';

export type FormDataFile = any;

export interface ImagePickerProps {
  children?: React.ReactNode;

  /**
   * Called when a user has selected an image/images
   * @param {FormDataFile | FormDataFile[]} value FormDataFile | FormDataFile[] that can be appended to FormData. Due to differences between platforms, we cannot determine a type
   */
  onSelect?(value: FormDataFile | FormDataFile[]): void;

  /**
   * When true, multiple images can be selected
   * @default false
   */
  isMultiple?: boolean;
}

// TODO: Implement React Native version of ImagePicker
export const ImagePicker = (props: ImagePickerProps) => {
  const { children } = props;

  // const handleOpenImagePicker = async () => {
  //   const result = await RNImagePicker.openPicker({ multiple: isMultiple });
  // };

  return (
    <>
      <TouchableOpacity>{children}</TouchableOpacity>
    </>
  );
};

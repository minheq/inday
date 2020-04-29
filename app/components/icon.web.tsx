import React from 'react';
import * as Feather from 'react-icons/fi';

import { useTheme } from '../theme';

import { IconProps } from './icon';

function convertToPascal(name: string) {
  const converter = (matches: string) => {
    return matches[1].toUpperCase();
  };

  const result = name.replace(/(\-\w)/g, converter);
  return result.charAt(0).toUpperCase() + result.slice(1);
}

export const Icon = ({ name, color = 'default', size = 'md' }: IconProps) => {
  const theme = useTheme();

  // @ts-ignore
  const IconTag = Feather[`Fi${convertToPascal(name)}`];

  return (
    <IconTag
      color={theme.text.color[color]}
      size={theme.text.size[size].fontSize}
    />
  );
};
